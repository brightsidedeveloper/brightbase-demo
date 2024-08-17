import { BrightBaseCRUD, BrightBaseCRUDTableRecord, QueryOptions, useSuspenseQuery } from 'brightbase'
import type { BrightBaseReadParams } from 'brightbase'

export default function useBrightSuspenseQuery<T extends BrightBaseCRUDTableRecord>(
  table: BrightBaseCRUD<T>,
  params: BrightBaseReadParams<T>,
  queryOptions?: QueryOptions<T[]>
) {
  return useSuspenseQuery({
    ...queryOptions,
    queryKey: [table.name, ...params],
    queryFn: () => table.read(...params),
  })
}
