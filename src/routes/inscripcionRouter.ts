import { Router } from 'express';
import {
  calificar,
  cancelarInscripcion,
  consultarInscripcion,
  consultarTodos,
  consultarxAlumno,
  consultarxCurso,
  inscribir,
  validar,
} from '../controllers/InscripcionController';

const router = Router();

router.get('/listarInscripciones', consultarTodos);

router.get('/creaInscripciones', (req, res) => {
  res.render('creaInscripciones', {
    pagina: 'Crear Inscripción',
  });
});

router.get('/xAlumno/:id', consultarxAlumno);

router.get('/xCurso/:id', consultarxCurso);

router.post('/', validar(), inscribir);

router.get(
  '/modificaInscripcion/:estudiante_id/:curso_id',
  async (req, res) => {
    try {
      const inscripcion = await consultarInscripcion(req, res);
      if (!inscripcion) {
        return res.status(404).send('Inscripcion no encontrado');
      }
      console.log(`estudiante: ${inscripcion}`);
      res.render('modificaInscripcion', {
        inscripcion,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(err.message);
      }
    }
  }
);

router.put('/:estudiante_id/:curso_id/:nota', calificar);

router.delete('/:estudiante_id/:curso_id', cancelarInscripcion);

export default router;
