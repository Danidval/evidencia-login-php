<?php
require_once __DIR__ . '/../models/Curso.php';

class CursoController {
    private $cursoModel;

    public function __construct($pdo) {
        $this->cursoModel = new Curso($pdo);
    }

    public function getAll() {
        $cursos = $this->cursoModel->getAll();
        return ['data' => $cursos];
    }

    public function getById($id) {
        $curso = $this->cursoModel->getById($id);
        if (!$curso) return ['error' => 'Curso no encontrado'];
        return ['data' => $curso];
    }

    public function create($data) {
        if (empty($data['titulo']) || empty($data['instructor']) || empty($data['precio'])) {
            return ['error' => 'Título, instructor y precio son obligatorios'];
        }
        $ok = $this->cursoModel->create(
            $data['titulo'],
            $data['descripcion'] ?? '',
            $data['instructor'],
            $data['imagen'] ?? '',
            $data['precio'],
            $data['id_creador'] ?? 1
        );
        return $ok ? ['message' => 'Curso creado'] : ['error' => 'Error al crear'];
    }

    public function update($id, $data) {
        $curso = $this->cursoModel->getById($id);
        if (!$curso) return ['error' => 'Curso no existe'];
        $ok = $this->cursoModel->update(
            $id,
            $data['titulo'],
            $data['descripcion'] ?? '',
            $data['instructor'],
            $data['imagen'] ?? '',
            $data['precio']
        );
        return $ok ? ['message' => 'Curso actualizado'] : ['error' => 'Error al actualizar'];
    }

    public function delete($id) {
        $curso = $this->cursoModel->getById($id);
        if (!$curso) return ['error' => 'Curso no existe'];
        $ok = $this->cursoModel->delete($id);
        return $ok ? ['message' => 'Curso eliminado'] : ['error' => 'Error al eliminar'];
    }
}
?>