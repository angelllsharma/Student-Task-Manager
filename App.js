const App = () => {
  const [tasks, setTasks] = React.useState([]);
  const [newTask, setNewTask] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("http://127.0.0.1:5000/api/tasks")
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    fetch("http://127.0.0.1:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newTask })
    })
      .then(res => res.json())
      .then(task => {
        setTasks(prev => [...prev, task]);
        setNewTask("");
      });
  };

  const deleteTask = (id) => {
    fetch(`http://127.0.0.1:5000/api/tasks/${id}`, { method: "DELETE" })
      .then(() => setTasks(prev => prev.filter(t => t.id !== id)));
  };

  const completeTask = (id) => {
    fetch(`http://127.0.0.1:5000/api/tasks/${id}/complete`, {
      method: "PATCH"
    }).then(() => {
      setTasks(prev => prev.map(t =>
        t.id === id ? { ...t, completed: true } : t
      ));
    });
  };

  const ongoing = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  return (
    <div className="container">
      <h1 className="glow">🎓 Student Task Manager</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter a new task"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {loading ? <div className="loader">Loading...</div> : (
        <>
          <div className="task-section">
            <h2>🟡 Ongoing Tasks</h2>
            {ongoing.length === 0 ? <p>No tasks in progress.</p> : (
              <table>
                <tbody>
                  {ongoing.map(task => (
                    <tr key={task.id}>
                      <td>{task.content}</td>
                      <td>
                        <button className="complete" onClick={() => completeTask(task.id)}>✅ Complete</button>
                        <button className="delete" onClick={() => deleteTask(task.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="task-section">
            <h2>✅ Completed Tasks</h2>
            {completed.length === 0 ? <p>No tasks done yet.</p> : (
              <ul className="completed-list">
                {completed.map(task => (
                  <li key={task.id}>
                    {task.content}
                    <button className="delete" onClick={() => deleteTask(task.id)}>🗑️</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
