"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDownIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import SearchInput from "../search-input";
import { Button } from "./button";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  initialColumnVisibility: VisibilityState;
  data: TData[];
  lastRefresh: string;
  onRefreshClick: React.MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
}

export function DataTable<TData, TValue>({
  data,
  onRefreshClick,
  columns,
  lastRefresh,
  initialColumnVisibility,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility,
  );

  // search state
  const onQueryChange = (query: string) => {
    setGlobalFilter(query);
  };

  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility: columnVisibility,
      globalFilter: globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const safeValue: string = (() => {
        const value = row.getValue(columnId);
        if (typeof value === "string") return value;
        return String(value);
      })();
      return safeValue?.toLowerCase().includes(filterValue.toLowerCase());
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: false,
    debugTable: true,
    debugColumns: true,
    debugHeaders: true,
    getColumnCanGlobalFilter: () => {
      return true;
    },
  });

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-row gap-6'>
          <Button
            variant={"outline"}
            onClick={onRefreshClick}
            className={isLoading ? "animate-spin" : ""}
            disabled={isLoading}>
            <ReloadIcon />
          </Button>
          <div className='flex flex-col'>
            <span className='text-sm text-muted-foreground'>Last refresh:</span>
            <span className='text-sm'>{`${lastRefresh}`}</span>
          </div>
        </div>
        <SearchInput query={globalFilter} onQueryChange={onQueryChange} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className=''>
              Columns <ChevronDownIcon className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='max-h-96 overflow-y-auto'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ?
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'>
                  No users.
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
