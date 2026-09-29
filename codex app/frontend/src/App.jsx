import { useEffect, useState } from 'react';

const API = '/api/todos';
const headers = { 'Content-Type': 'application/json' };

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function request(url = API, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
      let detail = 'Could not save that change. Please try again.';
      try { detail = (await response.json()).detail || detail; } catch {}
      throw new Error(detail);
    }
    return response.status === 204 ? null : response.json();
  }

  useEffect(() => {
    request().then(setTodos)
      .catch(() => setError('Could not load your tasks. Check that the app servers are running, then refresh.'))
      .finally(() => setLoading(false));
  }, []);

  async function addTodo(event) {
    event.preventDefault();
    if (!title.trim()) return;
    setError('');
    try {
      const todo = await request(API, { method: 'POST', headers, body: JSON.stringify({ title, notes }) });
      setTodos(items => [...items, todo]);
      setTitle('');
      setNotes('');
    } catch (e) { setError(e.message); }
  }

  async function update(todoId, changes) {
    setError('');
    const updated = await request(`${API}/${todoId}`, {
      method: 'PATCH', headers, body: JSON.stringify(changes),
    });
    setTodos(items => items.map(item => item.id === todoId ? updated : item));
    return updated;
  }

  async function toggle(todo) {
    try { await update(todo.id, { completed: !todo.completed }); }
    catch (e) { setError(e.message); }
  }

  async function saveEdit(event, todo) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newTitle = form.get('title').trim();
    if (!newTitle) { setError('Please enter a task name.'); return; }
    try {
      await update(todo.id, { title: newTitle, notes: form.get('notes').trim() });
      setEditing(null);
    } catch (e) { setError(e.message); }
  }

  async function remove(todo) {
    if (!window.confirm(`Delete "${todo.title}"?`)) return;
    try {
      await request(`${API}/${todo.id}`, { method: 'DELETE' });
      setTodos(items => items.filter(item => item.id !== todo.id));
      if (editing === todo.id) setEditing(null);
    } catch (e) { setError(e.message); }
  }

  async function move(todo, direction) {
    try { setTodos(await request(`${API}/${todo.id}/move/${direction}`, { method: 'POST' })); }
    catch (e) { setError(e.message); }
  }

  const remaining = todos.filter(todo => !todo.completed).length;
  return <main className="page">
    <header className="intro">
      <div className="eyebrow"><span className="sparkle">?</span> A LITTLE SPACE FOR YOUR PLANS</div>
      <h1>Make room<br />for <em>what matters.</em></h1>
      <p className="subtitle">One thing at a time. You?ve got this.</p>
    </header>
    <section className="list-card" aria-label="Your todo list">
      <form className="add-form" onSubmit={addTodo}>
        <label className="sr-only" htmlFor="new-title">Task name</label>
        <input id="new-title" maxLength="200" value={title} onChange={e => setTitle(e.target.value)} placeholder="What would you like to do?" required />
        <button type="submit" disabled={!title.trim()}>Add task <span>?</span></button>
        <label className="sr-only" htmlFor="new-notes">Notes (optional)</label>
        <textarea id="new-notes" className="add-notes" maxLength="5000" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add a note (optional)" rows="2" />
      </form>
      <div className="list-top"><span>YOUR LIST</span><span className="count">{remaining} TO DO</span></div>
      {loading ? <p className="empty">Getting your list ready?</p> : todos.length === 0 ?
        <div className="empty"><span className="empty-icon">?</span><strong>A fresh start.</strong><span>Add a task above and it?ll show up here.</span></div> :
        <ul>{todos.map((todo, index) => <li key={todo.id} className={todo.completed ? 'done' : ''}>
          <div className="todo-row">
            <button className="check" onClick={() => toggle(todo)} aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}>{todo.completed && '?'}</button>
            <div className="todo-copy"><span className="task-title">{todo.title}</span>{todo.notes && <p className="task-notes">{todo.notes}</p>}</div>
            <div className="actions">
              <button onClick={() => setEditing(editing === todo.id ? null : todo.id)} aria-label={`Edit ${todo.title}`} title="Edit">?</button>
              <button onClick={() => move(todo, 'up')} disabled={index === 0} aria-label="Move up" title="Move up">?</button>
              <button onClick={() => move(todo, 'down')} disabled={index === todos.length - 1} aria-label="Move down" title="Move down">?</button>
              <button className="delete" onClick={() => remove(todo)} aria-label={`Delete ${todo.title}`} title="Delete">?</button>
            </div>
          </div>
          {editing === todo.id && <form className="edit-form" onSubmit={event => saveEdit(event, todo)}>
            <label>Task name<input name="title" maxLength="200" defaultValue={todo.title} required /></label>
            <label>Notes<textarea name="notes" maxLength="5000" rows="3" defaultValue={todo.notes || ''} placeholder="Add details or a reminder" /></label>
            <div className="edit-buttons"><button type="button" className="cancel" onClick={() => setEditing(null)}>Cancel</button><button type="submit" className="save">Save changes</button></div>
          </form>}
        </li>)}</ul>}
      {error && <p className="error" role="alert">{error}</p>}
      {todos.length > 0 && <footer className="list-footer"><span>Small steps count, too.</span><span>{todos.length - remaining} DONE <b>?</b></span></footer>}
    </section>
    <p className="note"><span>?</span> Your list is saved in the app?s database.</p>
  </main>;
}
