import { Router } from 'express';
import {
  calificar,
  cancelarInscripcion,
  consultarTodos,
  consultarxAlumno,
  consultarxCurso,
  inscribir,
  validar,
} from '../controllers/InscripcionController';

const router = Router();

// Listar todas las inscripciones
router.get('/listarInscripciones', consultarTodos);

// Mostrar vista para crear una inscripción
router.get('/creaInscripciones', (req, res) => {
  res.render('creaInscripciones', {
    pagina: 'Crear Inscripción',
  });
});

router.get('/modificaInscripcion/:estudiante_id/:curso_id', (req, res) => {
  res.render('modificaInscripcion', {
    pagina: 'Calificar Inscripción',
  });
});

// Consultar inscripciones por alumno
router.get('/xAlumno/:id', consultarxAlumno);

// Consultar inscripciones por curso
router.get('/xCurso/:id', consultarxCurso);

// Inscribir un estudiante a un curso
router.post('/', validar(), inscribir);

// Calificar a un estudiante en un curso
router.put('/:estudiante_id/:curso_id', calificar);

// Cancelar una inscripción
router.delete('/:estudiante_id/:curso_id', cancelarInscripcion);

export default router;
