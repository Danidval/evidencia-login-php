<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/CursoController.php';

$method = $_SERVER['REQUEST_METHOD'];
$controller = new CursoController($pdo);

// Obtener ID de la URL (si viene)
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

// Obtener cuerpo de la petición para POST/PUT
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        if ($id) {
            $result = $controller->getById($id);
        } else {
            $result = $controller->getAll();
        }
        echo json_encode($result);
        break;

    case 'POST':
        $result = $controller->create($input);
        http_response_code(isset($result['error']) ? 400 : 201);
        echo json_encode($result);
        break;

    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID requerido']);
            break;
        }
        $result = $controller->update($id, $input);
        http_response_code(isset($result['error']) ? 400 : 200);
        echo json_encode($result);
        break;

    case 'DELETE':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'ID requerido']);
            break;
        }
        $result = $controller->delete($id);
        http_response_code(isset($result['error']) ? 400 : 200);
        echo json_encode($result);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
?>