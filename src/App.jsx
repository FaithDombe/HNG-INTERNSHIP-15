import { useMemo, useState } from 'react'
import TodoForm from './components/TodoForm.jsx'
import TodoList from './components/TodoList.jsx'
import TodoFilters from './components/TodoFilters.jsx'
import { useTodos } from './hooks/useTodos.js'
import { DEFAULT_FILTER } from './constants.js'
import './App.css'

function App() {
  const { todos, addTodo, toggleTodo, renameTodo, removeTodo, clearCompleted } =
    useTodos()
  const [filter, setFilter] = useState(DEFAULT_FILTER)

  const { remainingCount, completedCount } = useMemo(() => {
    const remaining = todos.filter((todo) => !todo.completed).length
    return { remainingCount: remaining, completedCount: todos.length - remaining }
  }, [todos])

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.completed)
    if (filter === 'completed') return todos.filter((todo) => todo.completed)
    return todos
  }, [filter, todos])

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">Todo List</h1>
        <p className="app__subtitle">Plan it, do it, tick it off.</p>
      </header>

      <TodoForm onAdd={addTodo} />

      {todos.length > 0 && (
        <TodoFilters
          filter={filter}
          onFilterChange={setFilter}
          remainingCount={remainingCount}
          completedCount={completedCount}
          onClearCompleted={clearCompleted}
        />
      )}

      <TodoList
        todos={visibleTodos}
        hasTodos={todos.length > 0}
        filter={filter}
        onToggle={toggleTodo}
        onRename={renameTodo}
        onRemove={removeTodo}
      />

      <footer className="app__footer">
        <p>Double-click a task to edit it. Everything is saved in your browser.</p>
      </footer>
    </main>
  )
}

export default App
