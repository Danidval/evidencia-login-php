<?php
/**
 * api/login.php
 * Servicio web de login: recibe JSON con username y password, responde JSON.
 * Método permitido: POST
 */

// --- CONFIGURACIÓN DE CABECERAS (HEADERS) ---
// Define que la respuesta será en formato JSON
header("Content-Type: application/json");
// Permite peticiones desde cualquier origen (CORS), útil para aplicaciones desacopladas
header("Access-Control-Allow-Origin: *");
// Define que solo se acepta el método POST para esta ruta
header("Access-Control-Allow-Methods: POST");
// Permite que el cliente envíe la cabecera Content-Type (necesario para JSON)
header("Access-Control-Allow-Headers: Content-Type");

// --- IMPORTACIÓN DE DEPENDENCIAS ---
// Se cargan la conexión a la base de datos y el controlador de autenticación
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/AuthController.php';

// --- VALIDACIÓN DEL MÉTODO DE PETICIÓN ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    // Si no es POST, devolvemos un error 405 (Method Not Allowed)
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido, use POST']);
    exit;
}

// --- RECEPCIÓN DE DATOS ---
// Leemos el cuerpo de la petición (raw input) y lo decodificamos de JSON a un array asociativo de PHP
$data = json_decode(file_get_contents("php://input"), true);

// --- VALIDACIÓN DE DATOS DE ENTRADA ---
// Verificamos que existan las llaves 'username' y 'password' en el JSON recibido
if (!isset($data['username']) || !isset($data['password'])) {
    // Si faltan datos, devolvemos un error 400 (Bad Request)
    http_response_code(400);
    echo json_encode(['error' => 'Faltan campos: username y password son obligatorios']);
    exit;
}

// Limpiamos el username de espacios en blanco innecesarios
$username = trim($data['username']);
$password = $data['password'];

// --- LÓGICA DE NEGOCIO ---
// Instanciamos el controlador pasando el objeto de conexión PDO (definido en database.php)
$auth = new AuthController($pdo);
// Ejecutamos el método login que debería validar las credenciales
$resultado = $auth->login($username, $password);

// --- RESPUESTA AL CLIENTE ---
if (isset($resultado['error'])) {
    // Si el controlador devuelve un error, mandamos un código 401 (Unauthorized)
    http_response_code(401); 
    echo json_encode($resultado);
} else {
    // Si el login es exitoso, mandamos un código 200 (OK) y la información del usuario/token
    http_response_code(200); 
    echo json_encode($resultado);
}
?>