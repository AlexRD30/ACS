const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;

// Middleware para parsear el cuerpo de las solicitudes POST
app.use(bodyParser.json());
app.use(express.static('public'));

// Inicializar la base de datos SQLite
const db = new sqlite3.Database('./mydb.sqlite3', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado a la base de datos SQLite.');
});

// Crear la tabla de tareas si no existe
db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, content TEXT, status TEXT)');

// Rutas para el manejo de las tareas
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const { content, status } = req.body;
  db.run('INSERT INTO tasks (content, status) VALUES (?, ?)', [content, status], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json({ id: this.lastID });
  });
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.run('UPDATE tasks SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json({ updated: this.changes });
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
