import express from "express";
const router=express.Router();
import incripcionController from '../controllers/InscripcionController';

router.get('/',incripcionController.consultarInscripciones);
router.get('/xAlumno/:id',incripcionController.consultarxAlumno );
router.get('/xCurso/:id',incripcionController.consultarxCurso );
router.post('/:estudiante_id/:curso_id',incripcionController.calificar );

router.post('/',incripcionController.inscribir );
router.delete('/:estudiante_id/:curso_id',incripcionController.cancelarInscripcion);

export default router;