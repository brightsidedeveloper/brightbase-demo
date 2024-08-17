import { BrightBaseCRUD, QueryOptions, BrightBaseCRUDTableRecord } from 'brightside-developer'

export default function useCreateQuery<T extends BrightBaseCRUDTableRecord>(
  table: BrightBaseCRUD<T>,
  params: Parameters<typeof table.read>,
  queryOptions?: Omit<QueryOptions<T[]>, 'queryKey' | 'queryFn'>
) {
  return {
    ...queryOptions,
    queryKey: [table.name, ...params],
    queryFn: () => table.read(...params),
  }
}

export type UseBrightSuspenseQueryReturn<T extends BrightBaseCRUDTableRecord> = ReturnType<typeof useCreateQuery<T>>
