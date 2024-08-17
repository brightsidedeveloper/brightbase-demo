import { BrightBaseCRUD, BrightBaseCRUDTableRecord, useQueryClient } from 'brightbase'
import { useCallback } from 'react'

export default function useInvalidateBrightQuery<T extends BrightBaseCRUDTableRecord>(
  table: BrightBaseCRUD<T>,
  params: Parameters<typeof table.read>
) {
  const queryClient = useQueryClient()

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: [table.name, ...params] }),
    [queryClient, table.name, params]
  )

  return invalidate
}
