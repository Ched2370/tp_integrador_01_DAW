import { Request, Response, Router } from 'express';
import {
  consultarTodos,
  consultarUno,
  eliminar,
  insertar,
  modificar,
  validar,
} from '../controllers/ProfesoresController';
const router = Router();

router.get('/listarProfesores', consultarTodos);

router.get('/creaProfesores', (req: Request, res: Response) => {
  res.render('creaProfesores', {
    pagina: 'Crear Profesor',
  });
});

router.post('/', validar(), insertar);

//modificar
router.get('/modificaProfesor/:id', async (req, res) => {
  try {
    const profesor = await consultarUno(req, res);
    if (!profesor) {
      return res.status(404).send('Profesor no encontrado');
    }
    res.render('modificaProfesor', {
      profesor,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
});

router.put('/:id', modificar);

//eliminar
router.delete('/:id', eliminar);

export default router;
