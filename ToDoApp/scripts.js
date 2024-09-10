document.getElementById("add-task-btn").addEventListener("click", addTask);

document
    .getElementById("task-input")
    .addEventListener("keypress", (e)=>{
    if(e.key == 'Enter'){
        addTask();
    }
});

document.addEventListener("DOMContentLoaded", loadTasks); // save the tasks in the DOM

function addTask() {
  const taskInput = document.getElementById("task-input");
  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  const task = {
    text: taskText,
    completed: false,
  };

  saveTaskToLocalStorage(task);
  displayTask(task);

  taskInput.value = ""; 
}

function displayTask(task) {
  const taskList = document.getElementById("task-list");
  const taskItem = document.createElement("li");
  const taskSpan = document.createElement("span");
  taskSpan.textContent = task.text;

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => editTask(taskSpan, task);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete";
  deleteBtn.onclick = () => {
    taskItem.remove();
    deleteTaskFromLocalStorage(task);
  };

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.onclick = () => {
    task.completed = !task.completed;
    taskItem.classList.toggle("completed");
    updateTaskInLocalStorage(task);
  };

  if (task.completed) {
    taskItem.classList.add("completed");
  }

  actionsDiv.append(checkbox, editBtn, deleteBtn);
  taskItem.append(taskSpan, actionsDiv);
  taskList.appendChild(taskItem);
}

function editTask(taskSpan, task) {
  const newTaskText = prompt("Edit task:", taskSpan.textContent);
  if (newTaskText !== null) {
    task.text = newTaskText.trim();
    taskSpan.textContent = task.text;
    updateTaskInLocalStorage(task);
  }
}

function saveTaskToLocalStorage(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => displayTask(task));
}

function updateTaskInLocalStorage(updatedTask) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((task) =>
    task.text === updatedTask.text ? updatedTask : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTaskFromLocalStorage(taskToDelete) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.text !== taskToDelete.text);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
