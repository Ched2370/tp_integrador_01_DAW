"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const InscripcionController_1 = require("../controllers/InscripcionController");
const router = (0, express_1.Router)();
router.get('/listarInscripcion', InscripcionController_1.consultarTodos);
/*router.get('/xAlumno/:id',incripcionController.consultarxAlumno );
router.get('/xCurso/:id',incripcionController.consultarxCurso );
router.post('/:estudiante_id/:curso_id',incripcionController.calificar );

router.post('/',incripcionController.inscribir );
router.delete('/:estudiante_id/:curso_id',incripcionController.cancelarInscripcion);
*/
exports.default = router;
