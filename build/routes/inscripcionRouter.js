"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const InscripcionController_1 = require("../controllers/InscripcionController");
const router = (0, express_1.Router)();
router.get('/listarInscripciones', InscripcionController_1.consultarTodos);
router.get('/creaInscripcion', (req, res) => {
    res.render('creaInscripcion', {
        pagina: 'Crear Inscripcion',
    });
});
router.get('/xAlumno/:id', InscripcionController_1.consultarxAlumno);
router.get('/xCurso/:id', InscripcionController_1.consultarxCurso);
// router.post('/:estudiante_id/:curso_id',calificar );
// router.post('/',inscribir );
// router.delete('/:estudiante_id/:curso_id',cancelarInscripcion);
exports.default = router;
