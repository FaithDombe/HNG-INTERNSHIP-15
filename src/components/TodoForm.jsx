import { useState } from 'react'

/** Add-task form. Reports success/failure back to the user inline. */
function TodoForm({ onAdd }) {
  const [text, setText] = useState('')
  const [hint, setHint] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (onAdd(text)) {
      setText('')
      setHint('')
      return
    }

    setHint('Type a task first, then press Add.')
  }

  function handleChange(event) {
    setText(event.target.value)
    if (hint) setHint('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        className="todo-form__input"
        placeholder="What needs doing?"
        value={text}
        onChange={handleChange}
        maxLength={120}
        autoComplete="off"
        aria-label="New task"
        aria-invalid={Boolean(hint)}
        aria-describedby="todo-form-hint"
      />
      <button type="submit" className="btn btn--primary">
        Add
      </button>
      <p
        id="todo-form-hint"
        className="todo-form__hint"
        role="status"
        aria-live="polite"
      >
        {hint}
      </p>
    </form>
  )
}

export default TodoForm
