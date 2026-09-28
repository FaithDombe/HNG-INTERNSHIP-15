import { useCallback, useEffect, useState } from 'react'

export const STORAGE_KEY = 'hng-todo-app/todos'

/** Create a collision-resistant id, with a fallback for older browsers. */
function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `todo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function createTodo(text) {
  return {
    id: createId(),
    text,
    completed: false,
    createdAt: Date.now(),
  }
}

/** Guard against corrupt or hand-edited localStorage payloads. */
function isTodo(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.text === 'string' &&
    value.text.trim() !== '' &&
    typeof value.completed === 'boolean'
  )
}

/** Read saved todos. Always returns an array, even if storage is unavailable. */
export function loadTodos() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter(isTodo) : []
  } catch (error) {
    console.warn('Could not read saved todos:', error)
    return []
  }
}

/**
 * Single source of truth for the todo list.
 * Keeps state in React and mirrors every change into localStorage.
 */
export function useTodos() {
  const [todos, setTodos] = useState(loadTodos)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch (error) {
      console.warn('Could not save todos:', error)
    }
  }, [todos])

  /** Add a todo. Returns false when the text is empty/whitespace only. */
  const addTodo = useCallback((text) => {
    const trimmed = text.trim()
    if (!trimmed) return false

    setTodos((current) => [...current, createTodo(trimmed)])
    return true
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }, [])

  /** Rename a todo. Returns false (and keeps the old text) when the draft is blank. */
  const renameTodo = useCallback((id, text) => {
    const trimmed = text.trim()
    if (!trimmed) return false

    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo)),
    )
    return true
  }, [])

  const removeTodo = useCallback((id) => {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos((current) => current.filter((todo) => !todo.completed))
  }, [])

  return { todos, addTodo, toggleTodo, renameTodo, removeTodo, clearCompleted }
}
