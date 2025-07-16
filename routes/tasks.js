const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/tasks.db');

// Init DB table
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  dueDate TEXT,
  status TEXT
)`);

// GET all tasks
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// POST new task
router.post('/', (req, res) => {
  const { title, dueDate, status } = req.body;
  db.run('INSERT INTO tasks (title, dueDate, status) VALUES (?, ?, ?)', [title, dueDate, status], function (err) {
    if (err) return res.status(500).send(err.message);
    res.status(201).json({ id: this.lastID });
  });
});

// DELETE a task
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', req.params.id, function (err) {
    if (err) return res.status(500).send(err.message);
    res.sendStatus(204);
  });
});

// PUT update task status
router.put('/:id', (req, res) => {
  db.run(`UPDATE tasks SET status = 
    CASE WHEN status = 'Pending' THEN 'Completed' ELSE 'Pending' END 
    WHERE id = ?`, req.params.id, function (err) {
    if (err) return res.status(500).send(err.message);
    res.sendStatus(200);
  });
});

module.exports = router;
