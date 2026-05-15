# Servicio Web de Registro y Login - API REST en PHP

Proyecto completo para la evidencia GA7-220501096-AA5-EV01.

Este sistema permite la gestión de usuarios mediante una arquitectura desacoplada (Backend API y Frontend HTML/JS).

## Características principales

- **Interfaz Visual:** Construida con Bootstrap 5 y Font Awesome, utilizando un sistema de pestañas para Login y Registro.
- **Endpoints de la API (JSON):**
  - `POST /api/register.php` → Registra un nuevo usuario en la base de datos.
  - `POST /api/login.php` → Autentica credenciales y devuelve el nombre del usuario.
- **Seguridad:**
  - Prevención de SQL Injection mediante sentencias preparadas (PDO).
  - Encriptación de contraseñas con el algoritmo bcrypt.
- **UX:** Mensajes de estado en tiempo real, validaciones de campos y panel de bienvenida (Dashboard) tras acceso exitoso.
- **Documentación:** Código fuente íntegramente comentado en español siguiendo buenas prácticas.

## Requisitos del Sistema

- **PHP:** 7.4 o superior (Extensiones: PDO, JSON).
- **Base de Datos:** MySQL 5.7 o superior.
- **Servidor Local:** XAMPP, WAMP o Laragon (Apache).

## Instalación y Configuración

1. **Despliegue:** Copia la carpeta `DANID_VALLEJOS_AA5_EV01` dentro del directorio `htdocs` de tu servidor local.
2. **Base de Datos:** Importa el archivo `sql/database.sql` desde phpMyAdmin para crear la estructura necesaria.
3. **Conexión:** Verifica las credenciales en `config/database.php`.
4. **URL Base:** Asegúrate de que en `public/js/main.js`, la constante `API_BASE` apunte a la carpeta correcta:
   ```javascript
   const API_BASE = window.location.origin + '/DANID_VALLEJOS_AA5_EV01/api/';
   ```
5. **Acceso:** Abre en tu navegador:
   ```
   http://localhost/DANID_VALLEJOS_AA5_EV01/public/index.html
   ```

## Pruebas de API (Postman / Insomnia)

- **Registro:**  
  URL: `http://localhost/DANID_VALLEJOS_AA5_EV01/api/register.php`  
  Método: POST  
  Body (JSON): `{"fullname":"David Posada","username":"david.posada","password":"123"}`  
  Respuesta esperada: `{"message":"Usuario creado con éxito"}`

- **Login:**  
  URL: `http://localhost/DANID_VALLEJOS_AA5_EV01/api/login.php`  
  Método: POST  
  Body (JSON): `{"username":"david.posada","password":"123"}`  
  Respuesta esperada: `{"message":"Autenticación satisfactoria","fullname":"David Posada"}`

## Versionamiento

Este proyecto se gestiona con Git. El historial de commits y el acceso al código fuente remoto se encuentran detallados en el archivo `enlace_repositorio.txt`.

## Autor

**Danid Vallejos**  
Aprendiz - Análisis y Desarrollo de Software (ADSO)  
SENA - 2026