const input = document.getElementById('todo-input');
const form = document.getElementById('todo-form');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const clearBtn = document.getElementById('clear-completed');

const STORAGE_KEY = 'local_todo_items';

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);

    pendingCount.textContent = pending.length;
    completedCount.textContent = completed.length;

    pending.forEach(t => {
        const li = document.createElement('li');
        li.innerHTML = `<input type='checkbox'/> <span>${t.text}</span> <button class='delete-btn'>🗑</button>`;
        li.querySelector('input').addEventListener('change', () => toggleTask(t.id));
        li.querySelector('button').addEventListener('click', () => deleteTask(t.id));
        pendingList.appendChild(li);
    });

    completed.forEach(t => {
        const li = document.createElement('li');
        li.classList.add('completed');
        li.innerHTML = `<input type='checkbox' checked/> <span>${t.text}</span> <button class='delete-btn'>🗑</button>`;
        li.querySelector('input').addEventListener('change', () => toggleTask(t.id));
        li.querySelector('button').addEventListener('click', () => deleteTask(t.id));
        completedList.appendChild(li);
    });
}

function addTask(text) {
    if (!text.trim()) return;
    const task = { id: Date.now(), text, completed: false };
    tasks.unshift(task);
    saveTasks();
    render();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
}

clearBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    render();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(input.value);
    input.value = '';
});

render();