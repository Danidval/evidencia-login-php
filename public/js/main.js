// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const API_BASE = window.location.origin + '/DANID_VALLEJOS_AA5_EV03/api/'; // CAMBIA EL NOMBRE DE TU CARPETA

// Elementos del DOM
const authPanel = document.getElementById('authPanel');
const dashboardPanel = document.getElementById('dashboardPanel');
const loginForm = document.getElementById('loginFormElement');
const registerForm = document.getElementById('registerFormElement');
const loginMsg = document.getElementById('loginMessage');
const registerMsg = document.getElementById('registerMessage');
const logoutBtn = document.getElementById('logoutBtn');
const cursosTableBody = document.getElementById('cursosTableBody');
const btnCrearCurso = document.getElementById('btnCrearCurso');
const saveCursoBtn = document.getElementById('saveCursoBtn');
const modalTitle = document.getElementById('modalTitle');
const cursoIdField = document.getElementById('cursoId');
const tituloField = document.getElementById('titulo');
const descripcionField = document.getElementById('descripcion');
const instructorField = document.getElementById('instructor');
const imagenField = document.getElementById('imagen');
const precioField = document.getElementById('precio');

let bootstrapModal;
let currentUser = null; // Para saber quién crea/edita (opcional)

// Inicializar modal de Bootstrap
document.addEventListener('DOMContentLoaded', () => {
    const modalElement = document.getElementById('cursoModal');
    bootstrapModal = new bootstrap.Modal(modalElement);
    // loadCursos(); // ELIMINADO: Se llama solo tras el login exitoso
});

// ============================================
// FUNCIONES DE LA API (AUTENTICACIÓN)
// ============================================
async function callApi(endpoint, data) {
    try {
        const response = await fetch(API_BASE + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        return { status: response.status, data: result };
    } catch (error) {
        console.error(error);
        return { status: 500, data: { error: 'Error de conexión' } };
    }
}

function showMessage(element, text, type) {
    element.innerHTML = text;
    element.className = 'message ' + type;
    if (type !== 'info') {
        setTimeout(() => {
            if (element.innerHTML === text) element.innerHTML = '';
        }, 4000);
    }
}

// ============================================
// LOGIN / REGISTRO
// ============================================
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showMessage(loginMsg, 'Usuario y contraseña requeridos', 'error');
        return;
    }
    
    showMessage(loginMsg, 'Verificando...', 'info');
    
    const { status, data } = await callApi('login.php', { username, password });
    
    if (status === 200 && data.message) {
        currentUser = data.fullname;
        
        // Limpiamos el mensaje de login al ingresar exitosamente
        loginMsg.innerHTML = '';
        loginMsg.className = 'message';
        
        authPanel.style.display = 'none';
        dashboardPanel.style.display = 'block';
        loadCursos(); // Cargar tabla de cursos al entrar
    } else {
        showMessage(loginMsg, data.error || 'Error en autenticación', 'error');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullname = document.getElementById('registerFullname').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const password2 = document.getElementById('registerPassword2').value;
    
    if (!fullname || !username || !password || !password2) {
        showMessage(registerMsg, 'Todos los campos son obligatorios', 'error');
        return;
    }
    
    if (password !== password2) {
        showMessage(registerMsg, 'Las contraseñas no coinciden', 'error');
        return;
    }
    
    showMessage(registerMsg, 'Registrando...', 'info');
    
    const { status, data } = await callApi('register.php', { fullname, username, password });
    
    if (status === 201 && data.message) {
        showMessage(registerMsg, data.message, 'success');
        setTimeout(() => {
            // Limpiar formulario con reset() es más limpio
            registerForm.reset();
            const loginTab = new bootstrap.Tab(document.getElementById('login-tab'));
            loginTab.show();
            showMessage(loginMsg, '¡Usuario creado! Ahora inicia sesión.', 'success');
        }, 1500);
    } else {
        showMessage(registerMsg, data.error || 'Error al registrar', 'error');
    }
});

logoutBtn.addEventListener('click', () => {
    authPanel.style.display = 'block';
    dashboardPanel.style.display = 'none';
    currentUser = null;
    cursosTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando cursos...</td></tr>';
    
    // CORRECCIÓN: Limpia el mensaje y clases de login
    loginMsg.innerHTML = '';
    loginMsg.className = 'message';
    
    // CORRECCIÓN: Limpia los campos de los formularios por seguridad
    loginForm.reset();
    registerForm.reset();
});

// ============================================
// CRUD DE CURSOS (usando fetch directo a cursos.php)
// ============================================
// Función genérica para peticiones a cursos.php (GET, POST, PUT, DELETE)
async function requestCursos(method, id = null, data = null) {
    let url = API_BASE + 'cursos.php';
    if (id && (method === 'GET' || method === 'PUT' || method === 'DELETE')) {
        url += `?id=${id}`;
    }
    
    const options = {
        method: method,
        headers: { 'Content-Type': 'application/json' }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    const result = await response.json();
    return { status: response.status, data: result };
}

// Cargar todos los cursos y mostrar en la tabla
async function loadCursos() {
    cursosTableBody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando...</td></tr>';
    const { status, data } = await requestCursos('GET');
    
    if (status === 200 && data.data) {
        renderCursosTable(data.data);
    } else {
        cursosTableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error al cargar cursos</td></tr>';
    }
}

function renderCursosTable(cursos) {
    if (!cursos.length) {
        cursosTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No hay cursos registrados</td></tr>';
        return;
    }
    
    let html = '';
    cursos.forEach(curso => {
        html += `
            <tr>
                <td>${curso.id}</td>
                <td>${escapeHtml(curso.titulo)}</td>
                <td>${escapeHtml(curso.descripcion || '')}</td>
                <td>${escapeHtml(curso.instructor)}</td>
                <td>$${parseFloat(curso.precio).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${curso.id}" data-titulo="${escapeHtml(curso.titulo)}" data-descripcion="${escapeHtml(curso.descripcion || '')}" data-instructor="${escapeHtml(curso.instructor)}" data-imagen="${escapeHtml(curso.imagen || '')}" data-precio="${curso.precio}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${curso.id}"><i class="fas fa-trash"></i> Eliminar</button>
                </td>
            </tr>
        `;
    });
    cursosTableBody.innerHTML = html;
    
    // Asignar eventos a los botones dinámicos
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(btn.dataset));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteCurso(btn.dataset.id));
    });
}

// Crear nuevo curso
btnCrearCurso.addEventListener('click', () => {
    modalTitle.innerText = 'Nuevo Curso';
    cursoIdField.value = '';
    tituloField.value = '';
    descripcionField.value = '';
    instructorField.value = '';
    imagenField.value = '';
    precioField.value = '';
    bootstrapModal.show();
});

saveCursoBtn.addEventListener('click', async () => {
    const id = cursoIdField.value;
    const cursoData = {
        titulo: tituloField.value.trim(),
        descripcion: descripcionField.value.trim(),
        instructor: instructorField.value.trim(),
        imagen: imagenField.value.trim(),
        precio: parseFloat(precioField.value)
    };
    
    if (!cursoData.titulo || !cursoData.instructor || isNaN(cursoData.precio)) {
        alert('Título, instructor y precio son obligatorios');
        return;
    }
    
    let response;
    if (id) {
        // Actualizar
        response = await requestCursos('PUT', id, cursoData);
    } else {
        // Crear
        cursoData.id_creador = 1; // Por ahora fijo, podrías usar el ID del usuario logueado si tienes sesión
        response = await requestCursos('POST', null, cursoData);
    }
    
    if (response.status === 200 || response.status === 201) {
        bootstrapModal.hide();
        loadCursos();
        alert(response.data.message);
    } else {
        alert('Error: ' + (response.data.error || 'No se pudo guardar'));
    }
});

function openEditModal(data) {
    modalTitle.innerText = 'Editar Curso';
    cursoIdField.value = data.id;
    tituloField.value = data.titulo;
    descripcionField.value = data.descripcion;
    instructorField.value = data.instructor;
    imagenField.value = data.imagen;
    precioField.value = data.precio;
    bootstrapModal.show();
}

async function deleteCurso(id) {
    if (!confirm('¿Eliminar este curso permanentemente?')) return;
    const response = await requestCursos('DELETE', id);
    
    if (response.status === 200) {
        loadCursos();
        alert(response.data.message);
    } else {
        alert('Error: ' + (response.data.error || 'No se pudo eliminar'));
    }
}

// Función para evitar XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        if (m === '"') return '&quot;'; // CORRECCIÓN: Protege comillas dobles
        if (m === "'") return '&#039;';  // CORRECCIÓN: Protege comillas simples
        return m;
    });
}