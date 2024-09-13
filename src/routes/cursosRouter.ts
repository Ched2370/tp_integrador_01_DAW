import express from "express";
import cursoController from '../controllers/CursoController';
const router=express.Router();
router.get('/',cursoController.consultarTodos);
router.post('/',cursoController.insertar);

router.route('/:id')
    .get(cursoController.consultarUno)
    .put(cursoController.modificar)
    .delete(cursoController.eliminar);

export default router;