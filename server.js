const express = require('express');
const app = express();
const path = require('path');
const tasksRoute = require('./routes/tasks');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/tasks', tasksRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
