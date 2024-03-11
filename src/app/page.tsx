"use client";

import UsersTable from "../components/users-table";

export default function Home() {
  return (
    <main>
      <section className='container flex flex-col gap-2 py-8'>
        <UsersTable />
      </section>
    </main>
  );
}
