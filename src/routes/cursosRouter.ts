import { Router } from 'express';
import {
  consultarTodos,
  consultarUno,
  eliminar,
  insertar,
  modificar,
  validar,
} from '../controllers/CursoController';
const router = Router();

router.get('/listarCursos', consultarTodos);

router.get('/creaCursos', (req, res) => {
  res.render('creaCursos', {
    pagina: 'Crear Curso',
  });
});

router.post('/', validar(), insertar);

router.get('/modificaCurso/:id', async (req, res) => {
  try {
    const curso = await consultarUno(req, res);
    if (!curso) {
      return res.status(404).send('Curso no encontrado');
    }
    res.render('modificaCurso', {
      curso,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
});

router.put('/:id', modificar);
router.delete('/:id', eliminar);

export default router;
