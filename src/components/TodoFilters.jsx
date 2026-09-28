import { FILTERS } from '../constants.js'

/** Filter chips, live remaining counter and the clear-completed action. */
function TodoFilters({
  filter,
  onFilterChange,
  remainingCount,
  completedCount,
  onClearCompleted,
}) {
  return (
    <section className="toolbar" aria-label="Task options">
      <div className="toolbar__filters" role="group" aria-label="Filter tasks">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`chip${filter === id ? ' chip--active' : ''}`}
            aria-pressed={filter === id}
            onClick={() => onFilterChange(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="toolbar__count" aria-live="polite">
        {remainingCount} {remainingCount === 1 ? 'task' : 'tasks'} left
      </p>

      {completedCount > 0 && (
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onClearCompleted}
        >
          Clear completed ({completedCount})
        </button>
      )}
    </section>
  )
}

export default TodoFilters
