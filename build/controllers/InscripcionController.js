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
exports.consultarxCurso = exports.consultarxAlumno = exports.consultarTodos = exports.validar = void 0;
const express_validator_1 = require("express-validator");
const conexion_1 = require("../db/conexion");
const cursoEstudianteModel_1 = require("../models/cursoEstudianteModel");
var inscripciones;
// Validaciones
const validar = () => [
    (0, express_validator_1.check)('estudiante_id')
        .notEmpty()
        .withMessage('Debe agregar el ID del estudiante')
        .isNumeric()
        .withMessage('Debe ser un número'),
    (0, express_validator_1.check)('curso_id')
        .notEmpty()
        .withMessage('Debe agregar el ID del curso')
        .isNumeric()
        .withMessage('Debe ser un número'),
    (req, res, next) => {
        const errores = (0, express_validator_1.validationResult)(req);
        if (!errores.isEmpty()) {
            return res.render('creaInscripciones', {
                pagina: 'Crea Inscripción',
                errores: errores.array(),
            });
        }
        next();
    },
];
exports.validar = validar;
// Consultar todas las inscripciones
const consultarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inscripcionesRepository = conexion_1.AppDataSource.getRepository(cursoEstudianteModel_1.CursoEstudiante);
        inscripciones = yield inscripcionesRepository.find();
        res.render('listarInscripciones', {
            pagina: 'Lista de inscripciones',
            varnav: 'listar',
            inscripciones,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).send(err.message);
        }
    }
});
exports.consultarTodos = consultarTodos;
// Consultar inscripción por alumno
const consultarxAlumno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        throw new Error('ID inválido, debe ser un número');
    }
    try {
        const inscripcionRepository = conexion_1.AppDataSource.getRepository(cursoEstudianteModel_1.CursoEstudiante);
        const inscripcion = yield inscripcionRepository.findOne({
            where: { estudiante_id: idNumber },
        });
        return inscripcion || null;
    }
    catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error('Error desconocido');
    }
});
exports.consultarxAlumno = consultarxAlumno;
const consultarxCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        throw new Error('ID inválido, debe ser un número');
    }
    try {
        const inscripcionRepository = conexion_1.AppDataSource.getRepository(cursoEstudianteModel_1.CursoEstudiante);
        const inscripcion = yield inscripcionRepository.findOne({
            where: { curso_id: idNumber },
        });
        return inscripcion || null;
    }
    catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error('Error desconocido');
    }
});
exports.consultarxCurso = consultarxCurso;
