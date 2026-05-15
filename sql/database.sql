-- ======================================================
-- Base de datos para el servicio web de registro y login
-- ======================================================

-- Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS servicio_web_db;
USE servicio_web_db;

-- Tabla de usuarios: almacena nombre completo, usuario y contraseña hasheada
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del usuario',
    nombre_completo VARCHAR(100) NOT NULL COMMENT 'Nombre completo del usuario (Ej: David Posada)',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre de usuario para login (Ej: david.posada)',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada con bcrypt',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de registro'
);

-- Insertar un usuario de prueba (David.Posada, contraseña: 123)
-- El hash fue generado con bcrypt para la contraseña '123'
INSERT INTO usuarios (nombre_completo, username, password_hash) VALUES 
('David Posada', 'david.posada', '$2b$12$2PnyiXyxmQFFv/6WTON1DeIAsrqr7aP4P7JmbWwj4eOjtwxnO5Pzq');