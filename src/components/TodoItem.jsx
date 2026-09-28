import { useEffect, useRef, useState } from 'react'

/**
 * A single task row.
 * Supports complete/incomplete, inline rename and delete.
 * Enter saves an edit, Escape cancels it, blur saves it.
 */
function TodoItem({ todo, onToggle, onRename, onRemove }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Keep the draft in sync when the todo changes from the outside.
  useEffect(() => {
    if (!isEditing) setDraft(todo.text)
  }, [isEditing, todo.text])

  function startEditing() {
    setDraft(todo.text)
    setIsEditing(true)
  }

  function cancelEditing() {
    setDraft(todo.text)
    setIsEditing(false)
  }

  function commitEditing() {
    const saved = onRename(todo.id, draft)
    setIsEditing(false)
    if (!saved) setDraft(todo.text)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      commitEditing()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      cancelEditing()
    }
  }

  if (isEditing) {
    return (
      <li className="todo todo--editing">
        <input
          ref={inputRef}
          type="text"
          className="todo__edit-input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEditing}
          maxLength={120}
          aria-label={`Edit "${todo.text}"`}
        />
        <p className="todo__edit-hint">Enter to save · Esc to cancel</p>
      </li>
    )
  }

  return (
    <li className={`todo${todo.completed ? ' todo--completed' : ''}`}>
      <input
        type="checkbox"
        className="todo__checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${
          todo.completed ? 'not completed' : 'completed'
        }`}
      />

      <span
        className="todo__text"
        onDoubleClick={startEditing}
        title="Double-click to edit"
      >
        {todo.text}
      </span>

      <div className="todo__actions">
        <button
          type="button"
          className="icon-btn"
          onClick={startEditing}
          title="Edit task"
          aria-label={`Edit "${todo.text}"`}
        >
          ✎
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => onRemove(todo.id)}
          title="Delete task"
          aria-label={`Delete "${todo.text}"`}
        >
          ✕
        </button>
      </div>
    </li>
  )
}

export default TodoItem
