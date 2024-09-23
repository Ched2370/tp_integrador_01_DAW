"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const InscripcionController_1 = require("../controllers/InscripcionController");
const router = (0, express_1.Router)();
// Listar todas las inscripciones
router.get('/listarInscripciones', InscripcionController_1.consultarTodos);
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
router.get('/xAlumno/:id', InscripcionController_1.consultarxAlumno);
// Consultar inscripciones por curso
router.get('/xCurso/:id', InscripcionController_1.consultarxCurso);
// Inscribir un estudiante a un curso
router.post('/', (0, InscripcionController_1.validar)(), InscripcionController_1.inscribir);
// Calificar a un estudiante en un curso
router.put('/:estudiante_id/:curso_id', InscripcionController_1.calificar);
// Cancelar una inscripción
router.delete('/:estudiante_id/:curso_id', InscripcionController_1.cancelarInscripcion);
exports.default = router;
