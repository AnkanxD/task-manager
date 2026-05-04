import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // ⚠️ IMPORTANT: change later after deploy
  const API = "https://task-manager-120z.onrender.com/tasks";

  const getTasks = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });

    setTitle("");
    getTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    getTasks();
  };

  const toggleTask = async (id) => {
    await fetch(`${API}/${id}/toggle`, { method: "PUT" });
    getTasks();
  };

  const editTask = async (id) => {
    const newTitle = prompt("Edit task:");
    if (!newTitle) return;

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle })
    });

    getTasks();
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const progress = total ? (completed / total) * 100 : 0;

  const filteredTasks = tasks.filter(task => {
    const match = task.title.toLowerCase().includes(search.toLowerCase());

    if (filter === "completed") return task.completed && match;
    if (filter === "pending") return !task.completed && match;

    return match;
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h2 style={styles.title}>Task Manager 🚀</h2>

        <div style={styles.row}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task..."
            style={styles.input}
          />
          <button onClick={addTask} style={styles.addBtn}>Add</button>
        </div>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...styles.input, marginBottom: "10px" }}
        />

        <div style={styles.row}>
          <button style={styles.filterBtn} onClick={() => setFilter("all")}>All</button>
          <button style={styles.filterBtn} onClick={() => setFilter("completed")}>Done</button>
          <button style={styles.filterBtn} onClick={() => setFilter("pending")}>Pending</button>
        </div>

        <div style={styles.stats}>
          Total: {total} | ✅ {completed} | ❌ {pending}
        </div>

        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>

        <ul style={styles.list}>
          {filteredTasks.map(task => (
            <li key={task._id} style={styles.task}>
              <span style={{
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#94a3b8" : "#fff"
              }}>
                {task.title}
              </span>

              <div style={styles.actions}>
                <button onClick={() => toggleTask(task._id)} style={styles.done}>
                  {task.completed ? "Undo" : "Done"}
                </button>

                <button onClick={() => editTask(task._id)} style={styles.edit}>
                  Edit
                </button>

                <button onClick={() => deleteTask(task._id)} style={styles.delete}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;


// STYLES
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: "420px",
    background: "#1e293b",
    padding: "25px",
    borderRadius: "12px"
  },
  title: { color: "#fff", marginBottom: "15px" },
  row: { display: "flex", gap: "10px", marginBottom: "10px" },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#334155",
    color: "#fff"
  },
  addBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px"
  },
  filterBtn: {
    background: "#334155",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px"
  },
  stats: { color: "#cbd5f5", fontSize: "13px" },
  progressBar: {
    height: "6px",
    background: "#334155",
    margin: "10px 0"
  },
  progressFill: { height: "100%", background: "#22c55e" },
  list: { listStyle: "none", padding: 0 },
  task: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    background: "#334155",
    padding: "10px",
    borderRadius: "8px"
  },
  actions: { display: "flex", gap: "6px" },
  done: { background: "#3b82f6", color: "#fff", border: "none" },
  edit: { background: "#f59e0b", color: "#fff", border: "none" },
  delete: { background: "#ef4444", color: "#fff", border: "none" }
};