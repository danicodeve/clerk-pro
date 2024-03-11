import { sleep } from "@/lib/utils";
import { Clerk, User } from "@clerk/backend";
import { isClerkAPIResponseError } from "@clerk/shared";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await clerkUsers();
    return Response.json({ users: users, status: 200 });
  } catch (error: unknown) {
    if (isClerkAPIResponseError(error)) {
      const clerkError = error.errors[0];
      const message = clerkError?.message ?? "Unable to get Clerk users.";
      return NextResponse.json({
        error: message,
        status: error.status,
      });
    }
    if (error instanceof Error) {
      return NextResponse.json({
        error: error.message,
        status: 500,
      });
    }
    return NextResponse.json({
      error: "Unable to get Clerk users.",
      status: 500,
    });
  }
}

async function clerkUsers() {
  if (!process.env.CLERK_SECRET_KEY)
    throw new Error("Environment variable CLERK_SECRET_KEY not found.");

  const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
  const clerkUsers: User[] = [];

  const maxRetries = 3;
  let retries = 0;

  const limit = 500;
  let offset = 0;

  while (retries < maxRetries) {
    try {
      const response = await clerk.users.getUserList({ limit, offset });
      clerkUsers.push(...response);
      await sleep(250);
      if (response.length === limit) {
        offset += limit;
      } else {
        // finished loading clerk users, exit loop
        break;
      }
    } catch (error) {
      retries++;
      throw error;
    }
  }
  if (retries === maxRetries) {
    throw new Error(`Error loading Clerk users. Tried ${maxRetries} times.`);
  }

  // remove duplicats which may occur due to data source change while fetching
  const uniqueClerkUsers = clerkUsers.reduce((accumulator: User[], current) => {
    if (!accumulator.find((user) => user.id === current.id)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);

  return uniqueClerkUsers;
}
