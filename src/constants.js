/**
 * Filter definitions shared by the app shell and the filter toolbar.
 * `id` values are also used as the `filter` state value in `App`.
 */
export const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
]

export const DEFAULT_FILTER = 'all'
