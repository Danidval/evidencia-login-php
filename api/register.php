<?php
/**
 * api/register.php
 * Servicio web de registro: recibe JSON con fullname, username, password y responde JSON.
 * Método permitido: POST
 * Ejemplo de entrada: {"fullname":"Ana Lopez","username":"ana.lopez","password":"123456"}
 */

// Configurar cabeceras para API REST
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Permitir peticiones desde cualquier origen
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Incluir dependencias
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/AuthController.php';

// Verificar que la petición sea de tipo POST (como se requiere en la actividad)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Método no permitido
    echo json_encode(['error' => 'Método no permitido, use POST']);
    exit;
}

// Leer el cuerpo de la petición (JSON) y convertirlo a array asociativo
$data = json_decode(file_get_contents("php://input"), true);

// Validar que existan los tres campos requeridos
if (!isset($data['fullname']) || !isset($data['username']) || !isset($data['password'])) {
    http_response_code(400); // Solicitud incorrecta
    echo json_encode(['error' => 'Faltan campos: fullname, username y password son obligatorios']);
    exit;
}

// Obtener y limpiar los datos
$fullname = trim($data['fullname']);
$username = trim($data['username']);
$password = $data['password'];

// Instanciar el controlador y ejecutar el registro
$auth = new AuthController($pdo);
$resultado = $auth->register($fullname, $username, $password);

// Devolver respuesta con el código HTTP adecuado
if (isset($resultado['error'])) {
    http_response_code(400); // Error (Bad Request o conflicto)
    echo json_encode($resultado);
} else {
    http_response_code(201); // Creado exitosamente
    echo json_encode($resultado);
}
?>