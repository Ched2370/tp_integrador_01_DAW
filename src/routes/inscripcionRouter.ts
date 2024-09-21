import { Router } from 'express';
import {
  consultarTodos,
  consultarxAlumno,
  consultarxCurso,
} from '../controllers/InscripcionController';
const router = Router();

router.get('/listarInscripciones', consultarTodos);

router.get('/creaInscripcion', (req, res) => {
  res.render('creaInscripcion', {
    pagina: 'Crear Inscripcion',
  });
});

router.get('/xAlumno/:id', consultarxAlumno);
router.get('/xCurso/:id', consultarxCurso);

// router.post('/:estudiante_id/:curso_id',calificar );

// router.post('/',inscribir );
// router.delete('/:estudiante_id/:curso_id',cancelarInscripcion);

export default router;
