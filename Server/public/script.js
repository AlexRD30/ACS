document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('addTaskButton');
    const newTaskInput = document.getElementById('newTaskInput');
    const taskList = document.getElementById('taskList');
    const completedTasksList = document.getElementById('completedTasksList');

    // Función para cargar tareas desde el backend
    function loadTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => {
                tasks.forEach(task => {
                    if(task.status === 'pending') {
                        addTaskToList(taskList, task);
                    } else {
                        addTaskToList(completedTasksList, task);
                    }
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Función para añadir tareas al DOM
    function addTaskToList(list, task) {
        const listItem = document.createElement('li');
        listItem.textContent = task.content;
        
        const checkButton = document.createElement('button');
        checkButton.textContent = '✓';
        checkButton.onclick = function() {
            updateTaskStatus(task.id, 'completed');
            listItem.remove();
            addTaskToList(completedTasksList, task);
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.onclick = function() {
            deleteTask(task.id);
            listItem.remove();
        };

        if(list === completedTasksList) {
            checkButton.style.display = 'none';
        }

        listItem.appendChild(checkButton);
        listItem.appendChild(deleteButton);

        list.appendChild(listItem);
    }

    // Función para añadir una nueva tarea
    addTaskButton.addEventListener('click', () => {
        const taskContent = newTaskInput.value.trim();
        if(taskContent) {
            addTask(taskContent);
            newTaskInput.value = '';
        }
    });

    // Función para enviar una nueva tarea al backend
    function addTask(content) {
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: content, status: 'pending' })
        })
        .then(response => response.json())
        .then(task => {
            addTaskToList(taskList, { id: task.id, content: content, status: 'pending' });
        })
        .catch(error => console.error('Error:', error));
    }

    // Función para actualizar el estado de una tarea en el backend
    function updateTaskStatus(id, status) {
        fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: status })
        })
        .catch(error => console.error('Error:', error));
    }

    // Función para eliminar una tarea del backend
    function deleteTask(id) {
        fetch(`/tasks/${id}`, {
            method: 'DELETE'
        })
        .catch(error => console.error('Error:', error));
    }

    // Cargar tareas al iniciar
    loadTasks();
});
