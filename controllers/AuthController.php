<?php
/**
 * controllers/AuthController.php
 * Controlador que maneja la lógica de registro y autenticación de usuarios
 */

require_once __DIR__ . '/../models/User.php';

class AuthController {
    private $userModel;

    public function __construct($pdo) {
        $this->userModel = new User($pdo);
    }

    /**
     * Registrar un nuevo usuario
     * @param string $fullname Nombre completo
     * @param string $username Nombre de usuario
     * @param string $password Contraseña en texto plano
     * @return array Respuesta con mensaje de éxito o error
     */
    public function register($fullname, $username, $password) {
        // Validar que ningún campo esté vacío
        if (empty($fullname) || empty($username) || empty($password)) {
            return ['error' => 'Todos los campos son requeridos'];
        }

        // Verificar si el nombre de usuario ya existe en la base de datos
        if ($this->userModel->findByUsername($username)) {
            return ['error' => 'El nombre de usuario ya está registrado'];
        }

        // Generar un hash seguro de la contraseña usando bcrypt
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Intentar guardar el nuevo usuario
        if ($this->userModel->create($fullname, $username, $hashedPassword)) {
            return ['message' => 'Usuario creado con éxito'];
        } else {
            return ['error' => 'Error al registrar usuario'];
        }
    }

    /**
     * Iniciar sesión (autenticación)
     * @param string $username Nombre de usuario
     * @param string $password Contraseña en texto plano
     * @return array Respuesta con mensaje y nombre completo si éxito, o error
     */
    public function login($username, $password) {
        if (empty($username) || empty($password)) {
            return ['error' => 'Usuario y contraseña son requeridos'];
        }

        $user = $this->userModel->findByUsername($username);
        if (!$user) {
            return ['error' => 'Error en la autenticación']; // Usuario no existe
        }

        // Verificar la contraseña contra el hash almacenado
        if (password_verify($password, $user['password_hash'])) {
            // Autenticación exitosa: devolver nombre completo para saludar
            return [
                'message' => 'Autenticación satisfactoria',
                'fullname' => $user['nombre_completo']
            ];
        } else {
            return ['error' => 'Error en la autenticación']; // Contraseña incorrecta
        }
    }
}
?>