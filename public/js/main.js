/**
 * public/js/main.js
 * Manejo de eventos de los formularios, comunicación con la API (fetch) y control de sesión.
 */

// --- Referencias a los elementos del DOM ---
const loginForm = document.getElementById('loginFormElement');
const registerForm = document.getElementById('registerFormElement');
const loginMsg = document.getElementById('loginMessage');
const registerMsg = document.getElementById('registerMessage');
const dashboard = document.getElementById('dashboard');
const welcomeMsg = document.getElementById('welcomeMessage');
const logoutBtn = document.getElementById('logoutBtn');

// --- Configuración de la URL base de la API ---
//window.location.origin=localhost:80

const API_BASE = window.location.origin + '/DANID_VALLEJOS_AA5_EV01/api/';

/**
 * Función genérica para realizar peticiones a la API
 * @param {string} endpoint - Nombre del archivo PHP (register.php o login.php)
 * @param {object} data - Datos a enviar en el cuerpo de la petición
 * @returns {Promise<{status: number, data: any}>}
 */
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
        console.error('Error de red:', error);
        return { status: 500, data: { error: 'Error de conexión con el servidor' } };
    }
}

/**
 * Función para mostrar mensajes (éxito, error, info) en un elemento
 * @param {HTMLElement} element - Contenedor del mensaje
 * @param {string} text - Texto a mostrar
 * @param {string} type - 'success', 'error' o 'info'
 */
function showMessage(element, text, type) {
    element.innerHTML = text;
    element.className = 'message ' + type;
    if (type !== 'info') {
        setTimeout(() => {
            if (element.innerHTML === text) {
                element.innerHTML = '';
                element.className = 'message';
            }
        }, 4000);
    }
}

// --- Evento: Envío del formulario de LOGIN ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showMessage(loginMsg, 'Usuario y contraseña son requeridos', 'error');
        return;
    }

    showMessage(loginMsg, 'Verificando...', 'info');
    const { status, data } = await callApi('login.php', { username, password });

    if (status === 200 && data.message) {
        // Login exitoso: ocultamos los formularios y mostramos el dashboard
        document.getElementById('index').style.display = 'none';
        dashboard.style.display = 'flex';
        welcomeMsg.innerHTML = `Bienvenido ${data.fullname}`;
        // Limpiamos los campos del formulario
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
    } else {
        showMessage(loginMsg, data.error || 'Error en la autenticación', 'error');
    }
});

// --- Evento: Envío del formulario de REGISTRO ---
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
        // Limpiar el formulario y cambiar a la pestaña de login automáticamente
        setTimeout(() => {
            document.getElementById('registerFullname').value = '';
            document.getElementById('registerUsername').value = '';
            document.getElementById('registerPassword').value = '';
            document.getElementById('registerPassword2').value = '';
            // Cambiar a la pestaña de login usando Bootstrap Tab API
            const loginTab = new bootstrap.Tab(document.getElementById('login-tab'));
            loginTab.show();
            showMessage(loginMsg, '¡Usuario creado con éxito! Ahora inicia sesión.', 'success');
        }, 1500);
    } else {
        showMessage(registerMsg, data.error || 'Error al registrar', 'error');
    }
});

// --- Evento: Cerrar sesión ---
logoutBtn.addEventListener('click', () => {
    dashboard.style.display = 'none';
    document.getElementById('index').style.display = 'block';
    // Limpiar mensajes por si quedaron
    loginMsg.innerHTML = '';
    registerMsg.innerHTML = '';
});