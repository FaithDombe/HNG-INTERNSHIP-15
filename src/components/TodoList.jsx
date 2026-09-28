import TodoItem from './TodoItem.jsx'

const EMPTY_MESSAGES = {
  all: 'Nothing here yet — add your first task above.',
  active: 'No active tasks. Everything is done! 🎉',
  completed: 'No completed tasks yet. Keep going!',
}

function TodoList({ todos, hasTodos, filter, onToggle, onRename, onRemove }) {
  if (todos.length === 0) {
    return (
      <p className="todo-list__empty">
        {hasTodos ? EMPTY_MESSAGES[filter] : EMPTY_MESSAGES.all}
      </p>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRename={onRename}
          onRemove={onRemove}
        />
      ))}
    </ul>
  )
}

export default TodoList
