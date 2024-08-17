import { BrightBaseCRUD, BrightBaseCRUDTableRecord, QueryOptions, useQuery } from 'brightbase'

export default function useBrightQuery<T extends BrightBaseCRUDTableRecord>(
  table: BrightBaseCRUD<T>,
  params: Parameters<typeof table.read>,
  queryOptions?: QueryOptions<T[]>
) {
  return useQuery({
    ...queryOptions,
    queryKey: [table.name, ...params],
    queryFn: () => table.read(...params),
  })
}
