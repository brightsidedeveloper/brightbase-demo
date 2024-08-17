import { BrightBaseCRUDTableRecord, QueryKey, useQueryClient } from 'brightbase'
import { useCallback } from 'react'
import { UseBrightSuspenseQueryReturn } from './useCreateQuery'

export default function useInvalidateQuery<T extends BrightBaseCRUDTableRecord>(
  opts: UseBrightSuspenseQueryReturn<T> | { queryKey: QueryKey }
) {
  const queryClient = useQueryClient()

  const invalidate = useCallback(() => queryClient.invalidateQueries({ queryKey: opts.queryKey }), [queryClient, opts.queryKey])

  return invalidate
}
