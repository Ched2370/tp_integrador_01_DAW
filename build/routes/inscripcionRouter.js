"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const InscripcionController_1 = require("../controllers/InscripcionController");
const router = (0, express_1.Router)();
router.get('/listarInscripciones', InscripcionController_1.consultarTodos);
router.get('/creaInscripciones', (req, res) => {
    res.render('creaInscripciones', {
        pagina: 'Crear Inscripción',
    });
});
router.get('/xAlumno/:id', InscripcionController_1.consultarxAlumno);
router.get('/xCurso/:id', InscripcionController_1.consultarxCurso);
router.post('/', (0, InscripcionController_1.validar)(), InscripcionController_1.inscribir);
router.get('/modificaInscripcion/:estudiante_id/:curso_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inscripcion = yield (0, InscripcionController_1.consultarInscripcion)(req, res);
        if (!inscripcion) {
            return res.status(404).send('Inscripcion no encontrado');
        }
        console.log(`estudiante: ${inscripcion}`);
        res.render('modificaInscripcion', {
            inscripcion,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
}));
router.put('/:estudiante_id/:curso_id/:nota', InscripcionController_1.calificar);
router.delete('/:estudiante_id/:curso_id', InscripcionController_1.cancelarInscripcion);
exports.default = router;
