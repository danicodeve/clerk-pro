import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export const flatten = (obj: any, delimiter = "/", prefix = "") =>
  Object.keys(obj).reduce((acc: any, k) => {
    const pre = prefix.length ? prefix + delimiter : prefix;
    if (
      typeof obj[k] === "object" &&
      obj[k] !== null &&
      Object.keys(obj[k]).length > 0
    ) {
      Object.assign(acc, flatten(obj[k], delimiter, pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});

export const getValidKeys = (array?: any[]) => {
  if (!array) return [];
  return [
    ...new Set(
      array.flatMap((obj: any) =>
        Object.keys(obj).filter((key) => {
          const value = obj[key];
          if (Array.isArray(value) && value.length === 0) return false;
          if (
            typeof value == "object" &&
            value !== null &&
            Object.keys(value).length === 0
          )
            return false;

          return obj[key] !== null;
        }),
      ),
    ),
  ];
};
