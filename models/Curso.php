<?php
class Curso {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function getAll() {
        $stmt = $this->pdo->query("SELECT * FROM cursos ORDER BY id DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM cursos WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($titulo, $descripcion, $instructor, $imagen, $precio, $id_creador) {
        $stmt = $this->pdo->prepare("INSERT INTO cursos (titulo, descripcion, instructor, imagen, precio, id_creador) VALUES (?, ?, ?, ?, ?, ?)");
        return $stmt->execute([$titulo, $descripcion, $instructor, $imagen, $precio, $id_creador]);
    }

    public function update($id, $titulo, $descripcion, $instructor, $imagen, $precio) {
        $stmt = $this->pdo->prepare("UPDATE cursos SET titulo = ?, descripcion = ?, instructor = ?, imagen = ?, precio = ? WHERE id = ?");
        return $stmt->execute([$titulo, $descripcion, $instructor, $imagen, $precio, $id]);
    }

    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM cursos WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
?>