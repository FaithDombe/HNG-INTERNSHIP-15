import { useEffect, useState } from 'react';

const STORAGE_KEY = 'little-list-todos';
function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      setError('Your browser could not save this list. Check that it has space for website data.');
    }
  }, [todos]);

  function addTodo(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    setTodos(items => [...items, {
      id: crypto.randomUUID(),
      title: cleanTitle,
      notes: notes.trim(),
      completed: false,
    }]);
    setTitle('');
    setNotes('');
    setError('');
  }

  function saveEdit(event, todo) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newTitle = form.get('title').trim();
    if (!newTitle) { setError('Please enter a task name.'); return; }
    setTodos(items => items.map(item => item.id === todo.id
      ? { ...item, title: newTitle, notes: form.get('notes').trim() }
      : item));
    setEditing(null);
    setError('');
  }

  function toggle(todo) {
    setTodos(items => items.map(item => item.id === todo.id
      ? { ...item, completed: !item.completed }
      : item));
  }

  function remove(todo) {
    if (!window.confirm(`Delete "${todo.title}"?`)) return;
    setTodos(items => items.filter(item => item.id !== todo.id));
    if (editing === todo.id) setEditing(null);
  }

  function move(todo, direction) {
    setTodos(items => {
      const index = items.findIndex(item => item.id === todo.id);
      const other = direction === 'up' ? index - 1 : index + 1;
      if (index < 0 || other < 0 || other >= items.length) return items;
      const reordered = [...items];
      [reordered[index], reordered[other]] = [reordered[other], reordered[index]];
      return reordered;
    });
  }

  const remaining = todos.filter(todo => !todo.completed).length;
  return <main className="page">
    <header className="intro">
      <div className="eyebrow"><span className="sparkle">{String.fromCharCode(10033)}</span> A LITTLE SPACE FOR YOUR PLANS</div>
      <h1>Make room<br />for <em>what matters.</em></h1>
      <p className="subtitle">One thing at a time. You have got this.</p>
    </header>
    <section className="list-card" aria-label="Your todo list">
      <form className="add-form" onSubmit={addTodo}>
        <label className="sr-only" htmlFor="new-title">Task name</label>
        <input id="new-title" maxLength="200" value={title} onChange={e => setTitle(e.target.value)} placeholder="What would you like to do?" required />
        <button type="submit" disabled={!title.trim()}>Add task <span>{String.fromCharCode(8599)}</span></button>
        <label className="sr-only" htmlFor="new-notes">Notes (optional)</label>
        <textarea id="new-notes" className="add-notes" maxLength="5000" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add a note (optional)" rows="2" />
      </form>
      <div className="list-top"><span>YOUR LIST</span><span className="count">{remaining} TO DO</span></div>
      {todos.length === 0 ?
        <div className="empty"><span className="empty-icon">{String.fromCharCode(10033)}</span><strong>A fresh start.</strong><span>Add a task above and it will show up here.</span></div> :
        <ul>{todos.map((todo, index) => <li key={todo.id} className={todo.completed ? 'done' : ''}>
          <div className="todo-row">
            <button className="check" onClick={() => toggle(todo)} aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}>{todo.completed && String.fromCharCode(10003)}</button>
            <div className="todo-copy"><span className="task-title">{todo.title}</span>{todo.notes && <p className="task-notes">{todo.notes}</p>}</div>
            <div className="actions">
              <button onClick={() => setEditing(editing === todo.id ? null : todo.id)} aria-label={`Edit ${todo.title}`} title="Edit">{String.fromCharCode(9998)}</button>
              <button onClick={() => move(todo, 'up')} disabled={index === 0} aria-label="Move up" title="Move up">{String.fromCharCode(8593)}</button>
              <button onClick={() => move(todo, 'down')} disabled={index === todos.length - 1} aria-label="Move down" title="Move down">{String.fromCharCode(8595)}</button>
              <button className="delete" onClick={() => remove(todo)} aria-label={`Delete ${todo.title}`} title="Delete">{String.fromCharCode(215)}</button>
            </div>
          </div>
          {editing === todo.id && <form className="edit-form" onSubmit={event => saveEdit(event, todo)}>
            <label>Task name<input name="title" maxLength="200" defaultValue={todo.title} required /></label>
            <label>Notes<textarea name="notes" maxLength="5000" rows="3" defaultValue={todo.notes || ''} placeholder="Add details or a reminder" /></label>
            <div className="edit-buttons"><button type="button" className="cancel" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="save">Save changes</button></div>
          </form>}
        </li>)}</ul>}
      {error && <p className="error" role="alert">{error}</p>}
      {todos.length > 0 && <footer className="list-footer"><span>Small steps count, too.</span><span>{todos.length - remaining} DONE <b>{String.fromCharCode(10033)}</b></span></footer>}
    </section>
    <p className="note"><span>{String.fromCharCode(10033)}</span> Saved in this browser only.</p>
  </main>;
}
