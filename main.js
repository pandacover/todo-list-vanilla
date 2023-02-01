const addTaskForm = document.getElementById('form-add-task');
const addTaskButton = document.getElementById('add-task-button');
const updateTaskButton = document.getElementById('update-task-button');
const todoListContainer = document.getElementById('todo-list-container');
const addTaskInput = document.getElementById('add-task-input');
const orderTaskButtons = document.querySelectorAll('#ordertask-button');

let allTasksList = document.querySelectorAll("#todolist-list");
let taskIDToUpdate = "";

const updateTaskList = () => {
    allTasksList = document.querySelectorAll("#todolist-list")
}

const onTaskNodeNotFoundError = (errorType) => {
    console.error(`No task node found! ${errorType} error.`)
}

const toggleUpdateAndAdd = () => {
    switch(addTaskButton.dataset.isVisible) {
        case "true": {
            addTaskButton.dataset.isVisible = "false";
            updateTaskButton.dataset.isVisible = "true";
            break;
        }
        case "false": {
            addTaskButton.dataset.isVisible = "true";
            updateTaskButton.dataset.isVisible = "false";
            break;
        }
        default: console.error('Invalid toggle type.');
    }
}

const updateLocalStorage = () => {
    localStorage.todos = Object.keys(allTasksList).map(id => allTasksList[id].querySelector('#todolist-task').innerText);
}

const resetTaskInput = () => addTaskInput.value = "";

const onAddTask = (e) => {
    e.preventDefault();
    addNewTask(addTaskInput.value);
    resetTaskInput();
}

const onDeleteTask = (e) => {
    e.preventDefault();
    deleteTask(e.currentTarget.dataset.task_id);
}

const onEditTask = (e) => {
    e.preventDefault();
    editTask(e.currentTarget.dataset.task_id);
}

const onUpdateTask = (e) => {
    e.preventDefault();
    updateTask();
    resetTaskInput();
}

const onOrderTask = (e) => {
    e.preventDefault();
    orderTasks(e);
}

const addNewTask = (task = "") => {
    if(task.length <= 0) {
        alert('Please fill the input field before submitting.');
        console.error('Task failed! No input given.');
        return;
    } 

    const task_id = crypto.randomUUID();
    const newTaskContainer = document.createElement('li');
    newTaskContainer.classList.add('todolist--list-wrapper');
    newTaskContainer.id = "todolist-list";
    newTaskContainer.dataset.task_id = task_id;
    newTaskContainer.dataset.createdAt = (new Date()).toLocaleDateString();

    const newTask = document.createElement('div');
    const newTaskText = document.createTextNode(task);
    newTask.classList.add('todolist--task');
    newTask.id = 'todolist-task';
    newTask.appendChild(newTaskText);

    newTaskContainer.appendChild(newTask);
    addUtilsButton(newTaskContainer, task_id);
    todoListContainer.appendChild(newTaskContainer);
    updateTaskList();
    updateLocalStorage();
}

const addUtilsButton = (taskNode, task_id) => {
    if(!taskNode) {
        onTaskNodeNotFoundError('Creation');
        return;
    }

    const newEditButton = document.createElement('button');
    newEditButton.id = "edit-task-button";
    newEditButton.classList.add('edit-task--button', 'primary-button');
    newEditButton.dataset.task_id = task_id;
    const editText = document.createTextNode('Edit');
    newEditButton.appendChild(editText);
    newEditButton.onclick = e => onEditTask(e);

    const newDeleteButton = document.createElement('button');
    newDeleteButton.id = "delete-task-button";
    newDeleteButton.classList.add('delete-task--button', 'primary-button');
    newDeleteButton.dataset.task_id = task_id;
    const deleteText = document.createTextNode('Delete');
    newDeleteButton.appendChild(deleteText);
    newDeleteButton.onclick = e => onDeleteTask(e);

    const newUtilsContainer = document.createElement('div');
    newUtilsContainer.id = "utils-container";
    newUtilsContainer.classList.add("utils-container");

    newUtilsContainer.appendChild(newEditButton);
    newUtilsContainer.appendChild(newDeleteButton);
    taskNode.appendChild(newUtilsContainer);
}

const deleteTask = (task_id) => {
    if(!task_id) {
        onTaskNodeNotFoundError('Deleting');
        return;
    }
    const findNodeToDelete = Object.keys(allTasksList).filter(id => allTasksList[id].dataset.task_id === task_id);
    const deletedNode = todoListContainer.removeChild(allTasksList[findNodeToDelete[0]]);
    updateTaskList();
    updateLocalStorage();
}

const editTask = (task_id) => {
    if(!task_id) {
        onTaskNodeNotFoundError('Editing');
        return;
    }
    toggleUpdateAndAdd();
    taskIDToUpdate = task_id;
    const findNodeToEditWrapper = Object.keys(allTasksList).filter(id => allTasksList[id].dataset.task_id === task_id);
    const findNodeToEdit = allTasksList[findNodeToEditWrapper[0]].querySelector('#todolist-task');
    addTaskInput.value = findNodeToEdit.innerText;
}

const updateTask = (task_id = taskIDToUpdate) => {
    if(!task_id) {
        onTaskNodeNotFoundError('Editing');
        return;
    }
    toggleUpdateAndAdd();
    const findNodeToEditWrapper = Object.keys(allTasksList).filter(id => allTasksList[id].dataset.task_id === task_id);
    const findNodeToEdit = allTasksList[findNodeToEditWrapper[0]].querySelector('#todolist-task');
    findNodeToEdit.innerHTML = "";
    const updateTask = document.createTextNode(addTaskInput.value);
    findNodeToEdit.appendChild(updateTask);
    updateTaskList();
    updateLocalStorage();
}

const orderTasks = (e) => {
    const orderBy = e.currentTarget.dataset.orderBy;
    todoListContainer.innerText = ""
    
    allTasksList = sorter(orderBy);

    Object.keys(allTasksList).forEach(id => {
        const taskText = allTasksList[id].querySelector('#todolist-task').innerText;
        setTimeout(() => addNewTask(taskText), 100);
    });
}

const sorter = (orderBy) => {

    let sortedTasksIndices = [];

    switch(orderBy) {
        case 'creationDateAsc': {
            sortedTasksIndices = Object.keys(allTasksList).sort((id_one, id_two) => {
                if(allTasksList[id_one].dataset.createdAt < allTasksList[id_two].dataset.createdAt) return -1;
                else if(allTasksList[id_one].dataset.createdAt > allTasksList[id_two].dataset.createdAt) return 1;
                return 0;
            });
            break;
        }
        case 'creationDateDsc': {
            sortedTasksIndices = Object.keys(allTasksList).sort((id_one, id_two) => {
                if(allTasksList[id_one].dataset.createdAt > allTasksList[id_two].dataset.createdAt) return -1;
                else if(allTasksList[id_one].dataset.createdAt < allTasksList[id_two].dataset.createdAt) return 1;
                return 0;
            });
            break;
        }
        case 'textAsc': {
            sortedTasksIndices = Object.keys(allTasksList).sort((id_one, id_two) => {
                if(allTasksList[id_one].querySelector('#todolist-task').innerText < allTasksList[id_two].querySelector('#todolist-task').innerText) return -1;
                if(allTasksList[id_one].querySelector('#todolist-task').innerText > allTasksList[id_two].querySelector('#todolist-task').innerText) return 1;
                return 0;
            })
            break;
        }
        case 'textDsc': {
            sortedTasksIndices = Object.keys(allTasksList).sort((id_one, id_two) => {
                if(allTasksList[id_one].querySelector('#todolist-task').innerText > allTasksList[id_two].querySelector('#todolist-task').innerText) return -1;
                if(allTasksList[id_one].querySelector('#todolist-task').innerText < allTasksList[id_two].querySelector('#todolist-task').innerText) return 1;
                return 1;
            })
            break;
        }
    }
    return sortedTasksIndices.map(id => allTasksList[id])
}

addTaskButton.addEventListener('click', onAddTask);
updateTaskButton.addEventListener('click', onUpdateTask);

window.addEventListener('load', () => {
    if(localStorage.todos.length <= 0) return;
    localStorage.todos.split(',').forEach(task => addNewTask(task));
})

Object.keys(orderTaskButtons).forEach(id => orderTaskButtons[id].addEventListener('click', onOrderTask));