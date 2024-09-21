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
const CursoController_1 = require("../controllers/CursoController");
const router = (0, express_1.Router)();
router.get('/listarCursos', CursoController_1.consultarTodos);
router.get('/creaCursos', (req, res) => {
    res.render('creaCursos', {
        pagina: 'Crear Curso',
    });
});
router.post('/', (0, CursoController_1.validar)(), CursoController_1.insertar);
router.get('/modificaCurso/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const curso = yield (0, CursoController_1.consultarUno)(req, res);
        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }
        res.render('modificaCurso', {
            curso,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
}));
router.put('/:id', CursoController_1.modificar);
router.delete('/:id', CursoController_1.eliminar);
exports.default = router;
