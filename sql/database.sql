-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS servicio_web_db;
USE servicio_web_db;

-- 2. Crear primero la tabla "padre" (usuarios)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del usuario',
    nombre_completo VARCHAR(100) NOT NULL COMMENT 'Nombre completo del usuario',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nombre de usuario para login',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de registro'
);

-- 3. Crear después la tabla "hija" (cursos) que referencia a usuarios
CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    instructor VARCHAR(100) NOT NULL,
    imagen VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL,
    id_creador INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_creador) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 4. Insertar datos de prueba
-- usuario david.posada contraseña 123
INSERT INTO usuarios (nombre_completo, username, password_hash) VALUES 
('David Posada', 'david.posada', '$2b$12$2PnyiXyxmQFFv/6WTON1DeIAsrqr7aP4P7JmbWwj4eOjtwxnO5Pzq');