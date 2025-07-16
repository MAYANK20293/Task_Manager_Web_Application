document.getElementById('task-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const dueDate = document.getElementById('dueDate').value;

  if (!title || !dueDate) return alert("Both fields are required!");

  await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, dueDate, status: 'Pending' })
  });

  this.reset();
  loadTasks();
});

async function loadTasks() {
  const res = await fetch('/tasks');
  const tasks = await res.json();
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'border p-2 flex justify-between items-center';
    li.innerHTML = `
      <div>
        <strong class="break-words max-w-[250px] block">${task.title}</strong>
<br>
        <small>${task.dueDate}</small>
      </div>
      <div class="flex gap-2">
        <button onclick="toggleStatus(${task.id})" class="text-sm ${task.status === 'Completed' ? 'text-green-500' : 'text-gray-500'}">
          ${task.status}
        </button>
        <button onclick="deleteTask(${task.id})" class="text-red-500 text-sm">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

async function toggleStatus(id) {
  await fetch(`/tasks/${id}`, {
    method: 'PUT'
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/tasks/${id}`, {
    method: 'DELETE'
  });
  loadTasks();
}

loadTasks();
