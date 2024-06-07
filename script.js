// Pobieranie referencji do elementów
const taskTitle = document.getElementById("taskTitle");
const taskContent = document.getElementById("taskContent");
const taskSpace = document.getElementById("taskSpace");
const addTaskButton = document.getElementById("addTaskButton");
const trashBin = document.getElementById("trashBin");

// Funkcja dodająca nową notatkę
function addTask() {
    if (taskTitle.value.trim() !== '') {
        const taskCard = document.createElement("div");
        taskCard.classList.add("taskCard");
        taskCard.draggable = true;

        const h3 = document.createElement("h3");
        h3.textContent = taskTitle.value;
        taskCard.appendChild(h3);

        const span = document.createElement("span");
        span.textContent = taskContent.value;
        taskCard.appendChild(span);

        taskCard.addEventListener('dragstart', handleDragStart);
        taskCard.addEventListener('dragend', handleDragEnd);

        taskSpace.appendChild(taskCard);
        saveTaskToLocalStorage(taskTitle.value, taskContent.value);

        taskTitle.value = '';
        taskContent.value = '';
    }
}

// Funkcja zapisywania notatki do localStorage
function saveTaskToLocalStorage(title, content) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ title, content });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Funkcja wczytująca notatki z localStorage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("taskCard");
        taskCard.draggable = true;

        const h3 = document.createElement("h3");
        h3.textContent = task.title;
        taskCard.appendChild(h3);

        const span = document.createElement("span");
        span.textContent = task.content;
        taskCard.appendChild(span);

        taskCard.addEventListener('dragstart', handleDragStart);
        taskCard.addEventListener('dragend', handleDragEnd);

        taskSpace.appendChild(taskCard);
    });
}

// Funkcje obsługi przeciągania i upuszczania
function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.innerHTML);
    event.dataTransfer.effectAllowed = 'move';
    event.target.classList.add('dragging');
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
}

trashBin.addEventListener('dragover', event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
});

trashBin.addEventListener('drop', event => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => {
        const taskHTML = `<h3>${task.title}</h3><span>${task.content}</span>`;
        return taskHTML !== data;
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    taskSpace.innerHTML = '';
    loadTasksFromLocalStorage();
});

// Podpięcie funkcji do przycisku dodawania notatki
addTaskButton.addEventListener('click', addTask);

// Wczytywanie notatek po załadowaniu strony
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);
