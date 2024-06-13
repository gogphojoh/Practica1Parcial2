document.getElementById('prueba').addEventListener('submit', agregarTarea);
document.getElementById('searchTerm').addEventListener('input', searchTasks);

function agregarTarea(event) {
    event.preventDefault();

    const tarean = document.getElementById('tarean').value;
    const fechai = document.getElementById('fechai').value;
    const fechaf = document.getElementById('fechaf').value;
    const nombre = document.getElementById('nombre').value;

    const errorMessage = Validar(fechai, fechaf);
    if (errorMessage) {
        document.getElementById('error-message').textContent = errorMessage;
        return;
    }

    const tarea = {
        tarean,
        fechai,
        fechaf,
        nombre,
        completada: false
    };

    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas.push(tarea);
    localStorage.setItem('tareas', JSON.stringify(tareas));

    document.getElementById('prueba').reset();
    document.getElementById('error-message').textContent = '';
    mostrarTareas();
}

function Validar(fechai, fechaf) {
    if (new Date(fechaf) < new Date(fechai)) {
        return 'La fecha de entrega no puede ser anterior a la fecha de asignación.';
    }
    return '';
}

function mostrarTareas(tareas = JSON.parse(localStorage.getItem('tareas')) || []) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();

    tareas = tareas.filter(tarea => {
        return tarea.tarean.toLowerCase().includes(searchTerm) || tarea.nombre.toLowerCase().includes(searchTerm);
    });

    tareas.forEach((tarea, index) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('list-group-item');

        const currentDate = new Date().toISOString().split('T')[0];

        if (tarea.completada) {
            taskItem.classList.add('task-completed');
        } else if (currentDate > tarea.fechaf) {
            taskItem.classList.add('task-expired');
        } else {
            taskItem.classList.add('task-pending');
        }

        taskItem.innerHTML = `
            <span>Tarea: ${tarea.tarean} - Responsable: ${tarea.nombre} - Asignado el ${tarea.fechai} hasta el ${tarea.fechaf}</span>
            <button class="btn btn-success btn-sm float-right ml-2" onclick="markAsCompleted(${index})">Completado</button>
            ${tarea.completada ? `<button class="btn btn-warning btn-sm float-right" onclick="unmarkAsCompleted(${index})">Desmarcar</button>` : ''}
            <button class="btn btn-danger btn-sm float-right mr-2" onclick="deleteTask(${index})">Eliminar</button>
        `;

        taskList.appendChild(taskItem);
    });
}

function markAsCompleted(index) {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    if (new Date(tareas[index].fechaf) >= new Date()) {
        tareas[index].completada = true;
        localStorage.setItem('tareas', JSON.stringify(tareas));
        mostrarTareas();
    } else {
        alert('No se puede marcar como completado. La fecha de entrega ha expirado.');
    }
}

function unmarkAsCompleted(index) {
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareas[index].completada = false;
    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarTareas();
}

function deleteTask(index) {
    if (confirm('¿Estás seguro que quieres borrar esta tarea?')) {
        let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        tareas.splice(index, 1);
        localStorage.setItem('tareas', JSON.stringify(tareas));
        mostrarTareas();
    }
}

function searchTasks() {
    mostrarTareas();
}

document.addEventListener('DOMContentLoaded', mostrarTareas);
