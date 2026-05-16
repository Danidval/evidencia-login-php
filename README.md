# Servicio Web – Autenticación y CRUD de Cursos (API REST en PHP)

**Evidencia:** GA7-220501096-AA5-EV03  
**Autor:** Danid Esneider Vallejos Almeida  
**SENA – Análisis y Desarrollo de Software – 2026**

---

## 📌 Descripción del proyecto

Sistema web que expone una **API REST** desarrollada en PHP con los siguientes servicios:

- **Autenticación de usuarios** (registro e inicio de sesión) con contraseñas hasheadas (bcrypt).
- **CRUD completo de cursos** (Crear, Leer, Actualizar, Eliminar) a través de endpoints JSON.
- **Interfaz web amigable** (Bootstrap 5 + JavaScript) que consume todos los servicios.
- **Seguridad:** Prevención de SQL Injection mediante PDO y sentencias preparadas.
- **Versionamiento** con Git (repositorio incluido).

El proyecto sigue una arquitectura MVC ligera (Modelo – Vista – Controlador) y está preparado para ser ejecutado en un servidor local (XAMPP, WAMP, Laragon).

---

## 🚀 Endpoints de la API (documentación completa)

### Autenticación

| Método | Endpoint | Descripción | Ejemplo de petición | Respuesta exitosa |
|--------|----------|-------------|----------------------|-------------------|
| **POST** | `/api/register.php` | Registra un nuevo usuario | `{"fullname":"Maria Gomez","username":"maria.g","password":"123456"}` | `201 Created` – `{"message":"Usuario creado con éxito"}` |
| **POST** | `/api/login.php` | Inicia sesión | `{"username":"maria.g","password":"123456"}` | `200 OK` – `{"message":"Autenticación satisfactoria","fullname":"Maria Gomez"}` |

**Validaciones:** campos obligatorios, usuario duplicado, credenciales incorrectas (401), métodos no permitidos (405).

### Gestión de cursos (requiere autenticación implícita)

| Método | Endpoint | Descripción | Ejemplo de petición / parámetro | Respuesta exitosa |
|--------|----------|-------------|--------------------------------|-------------------|
| **GET** | `/api/cursos.php` | Obtener todos los cursos | – | `200 OK` – `{"data": [ { "id":1, "titulo":"...", ... } ] }` |
| **GET** | `/api/cursos.php?id={id}` | Obtener un curso por ID | `id=1` | `200 OK` – `{"data": { "id":1, ... } }` |
| **POST** | `/api/cursos.php` | Crear un nuevo curso | `{"titulo":"PHP","instructor":"Ana","precio":49.99, "id_creador":1}` | `201 Created` – `{"message":"Curso creado"}` |
| **PUT** | `/api/cursos.php?id={id}` | Actualizar un curso existente | `{"titulo":"PHP avanzado","precio":79.99}` | `200 OK` – `{"message":"Curso actualizado"}` |
| **DELETE** | `/api/cursos.php?id={id}` | Eliminar un curso | `id=1` | `200 OK` – `{"message":"Curso eliminado"}` |

**Validaciones:** título, instructor y precio son obligatorios (400 Bad Request). Si el curso no existe se retorna `{"error":"Curso no encontrado"}`.

---

## 🛠️ Requisitos del sistema

- PHP 7.4 o superior (extensiones: PDO, JSON, bcrypt).
- MySQL 5.7 o superior.
- Servidor local: XAMPP, WAMP, Laragon (Apache).

---

## 📥 Instalación y configuración

1. **Clonar o copiar el proyecto**  
   Descarga la carpeta `DANID_VALLEJOS_AA5_EV03` y colócala dentro del directorio `htdocs` de XAMPP (o el equivalente de tu servidor).

2. **Crear la base de datos**  
   - Abre phpMyAdmin y crea una base de datos llamada `servicio_web_db`.  
   - Importa el archivo `sql/database.sql` (incluye las tablas `usuarios` y `cursos`).

3. **Configurar la conexión**  
   - Revisa las credenciales en `config/database.php` (por defecto: `root` sin contraseña).  
   - Ajusta el nombre de la base de datos si es diferente.

4. **Actualizar la URL base en el frontend**  
   - Abre `public/js/main.js` y asegúrate de que la constante `API_BASE` coincida con la ruta real de tu carpeta:

   ```javascript
   const API_BASE = window.location.origin + '/DANID_VALLEJOS_AA5_EV03/api/';
   ```

5. **Acceder a la aplicación**  
   Abre el navegador y ve a:
   ```
   http://localhost/DANID_VALLEJOS_AA5_EV03/public/index.html
   ```

---

## 🧪 Pruebas con Postman (opcional)

Puedes importar la colección incluida en el repositorio o probar manualmente los endpoints con cualquier cliente REST. Los ejemplos de petición/respuesta ya están documentados arriba.

**Nota:** Para las pruebas de cursos, primero debes registrar un usuario y obtener la sesión activa (la API no usa token, solo requiere que exista `id_creador` en las peticiones POST).

---

## 📁 Estructura del proyecto

```text
DANID_VALLEJOS_AA5_EV03/
│   .htaccess
│   .gitignore
│   README.md
│   enlace_repositorio.txt
│
├───api
│       login.php
│       register.php
│       cursos.php
│
├───config
│       database.php
│
├───controllers
│       AuthController.php
│       CursoController.php
│
├───models
│       User.php
│       Curso.php
│
├───public
│   │   index.html
│   ├───css
│   │       style.css
│   └───js
│           main.js
│
└───sql
        database.sql
```

---

## 🔗 Versionamiento (Git)

Este proyecto se encuentra versionado en GitHub. El enlace al repositorio remoto se detalla en el archivo `enlace_repositorio.txt` incluido en la carpeta comprimida.

- **Rama principal:** `ev03` (o `main` actualizado con el CRUD de cursos).
- **Historial de commits:** disponible en el repositorio.

---

## 👤 Autor

**Danid Esneider Vallejos Almeida**  
Aprendiz – Análisis y Desarrollo de Software (ADSO)  
SENA – Centro de formación – 2026

---

## 📄 Licencia

Proyecto con fines educativos – libre de uso y modificación para el aprendizaje.