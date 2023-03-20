const addTaskForm = document.getElementById("form-add-task");
const addTaskButton = document.getElementById("add-task-button");
const todoListContainer = document.getElementById("todo-list-container");
const addTaskInput = document.getElementById("add-task-input");
const orderTaskSelection = document.getElementById("addtask-order-selection");

const sourceURL = "https://jsonplaceholder.typicode.com/todos";

let allTasksArray = [];
let taskIDToUpdate = "";
let endIndex = -1;

const reRenderListDOM = () => {
  todoListContainer.innerHTML = "";
  allTasksArray.forEach((task) => addNewTask(task.task, task.id));
};

const findIndexFromID = (task_id = "") => {
  return allTasksArray.findIndex((task) => task.id === task_id);
};

const onTaskNodeNotFoundError = (errorType) => {
  console.error(`No task node found! ${errorType} error.`);
};

const toggleEditAndUpdate = (replaceFrom, replaceTo) => {
  replaceFrom.replaceWith(replaceTo);
};

const createUpdateButton = () => {
  const updateTaskButton = document.createElement("button");
  const updateTaskText = document.createTextNode("Update Task");
  updateTaskButton.appendChild(updateTaskText);
  updateTaskButton.id = "update-task-button";
  updateTaskButton.classList.add("update--task-button", "primary-button");
  return updateTaskButton;
};

const updateLocalStorage = () => {
  const stringifiedTasks = JSON.stringify(allTasksArray);
  if (stringifiedTasks === "[]") {
    localStorage.removeItem("todos");
    return;
  }
  localStorage.setItem("todos", stringifiedTasks);
};

const resetTaskInput = () => (addTaskInput.value = "");

const onAddTask = (e) => {
  e.preventDefault();
  addNewTask(addTaskInput.value);
  resetTaskInput();
};

const onDeleteTask = (e) => {
  e.preventDefault();
  deleteTask(e.currentTarget.dataset.task_id);
};

const onEditTask = (e) => {
  e.preventDefault();
  editTask(e.currentTarget.dataset.task_id, e);
};

const onUpdateTask = (e, task_id) => {
  e.preventDefault();
  updateTask(task_id);
  resetTaskInput();
};

const onOrderTask = (e) => {
  orderTasks(e);
};

const onDragOver = (e) => {
  e.preventDefault();
};

const onDrop = (e) => {
  endIndex = findIndexFromID(e.currentTarget.dataset.task_id);
};

const onDragEnd = (e) => {
  const targetIndex = findIndexFromID(e.target.dataset.task_id);
  const taskToOrder = allTasksArray[targetIndex];
  allTasksArray = allTasksArray.filter(
    (task) => task.id !== e.target.dataset.task_id
  );
  allTasksArray = [
    ...allTasksArray.slice(0, endIndex),
    taskToOrder,
    ...allTasksArray.slice(endIndex),
  ];
  reRenderListDOM();
};

const addNewTask = (task = "", taskIDToAssign = "") => {
  if (!task && task.length <= 0) {
    alert("Please fill the input field before submitting.");
    console.error("Task failed! No input given.");
    return;
  }

  const task_id =
    taskIDToAssign.length > 0 ? taskIDToAssign : crypto.randomUUID();
  const newTaskContainer = document.createElement("li");
  newTaskContainer.classList.add("todolist--list-wrapper");
  newTaskContainer.id = "todolist-list";
  newTaskContainer.dataset.task_id = task_id;

  const newTask = document.createElement("div");
  const newTaskText = document.createTextNode(task);
  newTask.classList.add("todolist--task");
  newTask.id = "todolist-task";
  newTask.appendChild(newTaskText);

  newTaskContainer.draggable = "true";
  newTaskContainer.addEventListener("dragend", onDragEnd);
  newTaskContainer.addEventListener("dragover", onDragOver);
  newTaskContainer.addEventListener("drop", onDrop);

  newTaskContainer.appendChild(newTask);
  addUtilsButton(newTaskContainer, task_id);
  todoListContainer.appendChild(newTaskContainer);

  if (findIndexFromID(task_id) === -1)
    allTasksArray.push({
      id: task_id,
      task,
      createdAt: new Date().toLocaleDateString(),
    }); // add element to the array

  updateLocalStorage();
};

const addUtilsButton = (taskNode, task_id) => {
  if (!taskNode) {
    onTaskNodeNotFoundError("Creation");
    return;
  }

  const newEditButton = document.createElement("button");
  newEditButton.id = "edit-task-button";
  newEditButton.classList.add("edit-task--button", "primary-button");
  newEditButton.dataset.task_id = task_id;
  const editText = document.createTextNode("Edit");
  newEditButton.appendChild(editText);
  newEditButton.onclick = (e) => onEditTask(e);

  const newDeleteButton = document.createElement("button");
  newDeleteButton.id = "delete-task-button";
  newDeleteButton.classList.add("delete-task--button", "primary-button");
  newDeleteButton.dataset.task_id = task_id;
  const deleteText = document.createTextNode("Delete");
  newDeleteButton.appendChild(deleteText);
  newDeleteButton.onclick = (e) => onDeleteTask(e);

  const newUtilsContainer = document.createElement("div");
  newUtilsContainer.id = "utils-container";
  newUtilsContainer.classList.add("utils-container");

  newUtilsContainer.appendChild(newEditButton);
  newUtilsContainer.appendChild(newDeleteButton);
  taskNode.appendChild(newUtilsContainer);
};

const deleteTask = (task_id) => {
  if (!task_id) {
    onTaskNodeNotFoundError("Deleting");
    return;
  }

  allTasksArray = allTasksArray.filter((task) => task.id !== task_id); // remove element from array
  todoListContainer.innerHTML = "";
  reRenderListDOM();
  updateLocalStorage();
};

const editTask = (task_id, e) => {
  if (!task_id) {
    onTaskNodeNotFoundError("Editing");
    return;
  }
  const toggledInputElement = document.createElement("input");
  const indexToEdit = findIndexFromID(task_id);

  toggledInputElement.id = task_id;
  toggledInputElement.classList.add("updatetask--input");
  toggledInputElement.type = "text";
  toggledInputElement.value = allTasksArray[indexToEdit].task;
  toggledInputElement.placeholder = allTasksArray[indexToEdit].task;

  const todos = todoListContainer.querySelectorAll("li");
  const targetToEdit =
    todos[
      Object.keys(todos).findIndex(
        (id) => todos[id].dataset.task_id === task_id.toString()
      )
    ];
  targetToEdit.firstChild.replaceWith(toggledInputElement);

  const updateTaskButton = createUpdateButton();
  updateTaskButton.addEventListener("click", (e) => onUpdateTask(e, task_id));
  toggleEditAndUpdate(e.target, updateTaskButton);
};

const updateTask = (task_id = taskIDToUpdate) => {
  if (!task_id) {
    onTaskNodeNotFoundError("Editing");
    return;
  }
  const todos = todoListContainer.querySelectorAll("li");
  const targetToEdit =
    todos[
      Object.keys(todos).findIndex(
        (id) => todos[id].dataset.task_id === task_id.toString()
      )
    ];
  const indexToUpdate = findIndexFromID(task_id);

  allTasksArray[indexToUpdate] = {
    id: task_id,
    task: targetToEdit.firstChild.value,
    createdAt: allTasksArray[indexToUpdate].createdAt,
  };

  reRenderListDOM(); // resets the list DOM
  updateLocalStorage();
};

const orderTasks = (e) => {
  const orderBy = e.currentTarget.value;
  todoListContainer.innerText = "";

  switch (orderBy) {
    case "creationDateAsc": {
      sorter("ASC", "createdAt");
      break;
    }
    case "creationDateDsc": {
      sorter("DSC", "createdAt");
      break;
    }
    case "textAsc": {
      sorter("ASC", "task");
      break;
    }
    case "textDsc": {
      sorter("DSC", "task");
      break;
    }
  }

  reRenderListDOM(); // resets the list DOM
};

const sorter = (orderIn, orderKey) => {
  switch (orderIn) {
    case "ASC": {
      allTasksArray.sort((task_a, task_b) => {
        const temp_a = task_a[orderKey].toLowerCase(),
          temp_b = task_b[orderKey].toLowerCase();
        if (temp_a < temp_b) return -1;
        else if (temp_a > temp_b) return 1;
        return 0;
      });
      break;
    }
    case "DSC": {
      allTasksArray.sort((task_a, task_b) => {
        const temp_a = task_a[orderKey].toLowerCase(),
          temp_b = task_b[orderKey].toLowerCase();
        if (temp_a > temp_b) return -1;
        else if (temp_a < temp_b) return 1;
        return 0;
      });
      break;
    }
  }
};

addTaskButton.addEventListener("click", onAddTask);

window.addEventListener("load", () => {
  const tasksFromLocalStorage = localStorage.getItem("todos");
  if (!tasksFromLocalStorage || tasksFromLocalStorage.length === 0) {
    const createdAt = new Date().toLocaleDateString();
    fetch(sourceURL)
      .then((res) => res.json())
      .then((task) => {
        for (let i = 0; i < 10; ++i)
          allTasksArray.push({
            id: task[i].id.toString(),
            task: task[i].title,
            createdAt,
          });
        reRenderListDOM();
      });
  } else {
    allTasksArray = [...JSON.parse(tasksFromLocalStorage)];
    reRenderListDOM();
  }
});

Object.keys(orderTaskSelection.options).forEach((index) =>
  orderTaskSelection.options[index].addEventListener("click", onOrderTask)
);

// const promise = new Promise();
