import express from "express";
const router=express.Router();
import profesorController from '../controllers/ProfesoresController';

router.get('/',profesorController.consultarTodos);
router.post('/',profesorController.insertar);

router.route('/:id')
    .get(profesorController.consultarUno)
    .put(profesorController.modificar)
    .delete(profesorController.eliminar);

export default router;