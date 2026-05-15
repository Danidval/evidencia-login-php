<?php
/**
 * config/database.php
 * 
 * Configuración de la conexión a la base de datos MySQL usando PDO
 * PDO significa PHP Data Objects (Objetos de Datos de PHP). Es 
 * una extensión ligera y orientada a objetos para PHP que 
 * proporciona una capa de abstracción para acceder a bases de datos. 
 * Permite interactuar con diversos sistemas (MySQL, PostgreSQL, SQLite, etc.) 
 * usando el mismo código, 
 * mejorando la seguridad frente a inyecciones SQL
 */

$host = 'localhost';      // Servidor de base de datos (generalmente localhost)
$dbname = 'servicio_web_db'; // Nombre de la base de datos creada
$username = 'root';       // Usuario de MySQL (por defecto en XAMPP es 'root')
$password = '';           // Contraseña de MySQL (vacía en XAMPP)

try {
    // Crear una nueva instancia de PDO para la conexión
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    // Configurar el modo de errores para que lance excepciones
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // En caso de error, responder con JSON y detener la ejecución
    die(json_encode(['error' => 'Error de conexión a la base de datos']));
}
?>