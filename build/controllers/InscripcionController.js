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
exports.consultarTodos = exports.validar = void 0;
const express_validator_1 = require("express-validator");
const conexion_1 = require("../db/conexion");
const cursoEstudianteModel_1 = require("../models/cursoEstudianteModel");
var inscripciones;
const validar = () => [
    (0, express_validator_1.check)('estudiante_id')
        .notEmpty()
        .withMessage('Debe agregar el ID del estudiante')
        .isNumeric()
        .withMessage('debe ser un numero'),
    (0, express_validator_1.check)('curso_id')
        .notEmpty()
        .withMessage('Debe agregar el ID del curso')
        .isNumeric()
        .withMessage('debe ser un numero'),
    (req, res, next) => {
        const errores = (0, express_validator_1.validationResult)(req);
        if (!errores.isEmpty()) {
            return res.render('creaInscripciones', {
                pagina: 'Crea Inscripcion',
                errores: errores.array(),
            });
        }
        next();
    },
];
exports.validar = validar;
const consultarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inscripcionesRepository = conexion_1.AppDataSource.getRepository(cursoEstudianteModel_1.CursoEstudiante);
        console.log('rede');
        inscripciones = yield inscripcionesRepository.find();
        res.render('listarInscripciones', {
            pagina: 'Lista de inscripciones',
            varnav: 'listar',
            inscripciones,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarTodos = consultarTodos;
