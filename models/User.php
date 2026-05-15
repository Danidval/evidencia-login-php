<?php
/**
 * models/User.php
 * Modelo que contiene las operaciones CRUD sobre 
 * la tabla 'usuarios'
 */

require_once __DIR__ . '/../config/database.php';

class User {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Buscar un usuario por su nombre de usuario (para login)
     * @param string $username
     * @return array|false Devuelve los datos del usuario o false si no existe
     */
    public function findByUsername($username) {
        $stmt = $this->pdo->prepare("SELECT * FROM usuarios WHERE username = ?");
        $stmt->execute([$username]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Crear un nuevo usuario en la base de datos
     * @param string $fullname Nombre completo
     * @param string $username Nombre de usuario
     * @param string $hashedPassword Contraseña ya hasheada con bcrypt
     * @return bool True si se insertó correctamente
     */
    public function create($fullname, $username, $hashedPassword) {
        $stmt = $this->pdo->prepare("INSERT INTO usuarios (nombre_completo, username, password_hash) VALUES (?, ?, ?)");
        return $stmt->execute([$fullname, $username, $hashedPassword]);
    }
}
?>