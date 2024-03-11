"use client";

import { ChangeEvent } from "react";
import { Input } from "./ui/input";

const SearchInput = ({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
}) => {
  return (
    <Input
      value={query}
      type='text'
      className='max-w-sm'
      placeholder='Search users...'
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        onQueryChange(event.target.value);
      }}
    />
  );
};

export default SearchInput;
