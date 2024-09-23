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
exports.calificar = exports.cancelarInscripcion = exports.inscribir = exports.consultarxCurso = exports.consultarxAlumno = exports.consultarTodos = exports.validar = void 0;
const express_validator_1 = require("express-validator");
const conexion_1 = require("../db/conexion");
const cursoEstudianteModel_1 = require("../models/cursoEstudianteModel");
const cursoModel_1 = require("../models/cursoModel");
const estudianteModel_1 = require("../models/estudianteModel");
var inscripciones;
const validar = () => [
    (0, express_validator_1.check)('estudiante_id')
        .notEmpty()
        .isNumeric()
        .withMessage('Debe agregar ID del estudiante'),
    (0, express_validator_1.check)('curso_id')
        .notEmpty()
        .isNumeric()
        .withMessage('Debe agregar ID del curso'),
    (req, res, next) => {
        const errores = (0, express_validator_1.validationResult)(req);
        if (!errores.isEmpty()) {
            return res.render('creaInscripciones', {
                pagina: 'Crear Inscripcion',
                //errores: errores.array(),
            });
        }
        next();
    },
];
exports.validar = validar;
const consultarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inscripcionesRepository = conexion_1.AppDataSource.getRepository(cursoEstudianteModel_1.CursoEstudiante);
        const inscripciones = yield inscripcionesRepository.find({
            relations: ['estudiante', 'curso'],
        });
        res.render('listarInscripciones', {
            pagina: 'Listar de Inscripciones',
            varnav: 'listar',
            inscripciones,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send('Error al consultar las inscripciones');
        }
    }
});
exports.consultarTodos = consultarTodos;
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
        res.status(200).json(inscripcion);
    }
    catch (err) {
        res.status(500).send('Error al consultar inscripciones por alumno');
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
        res.status(200).json(inscripcion);
    }
    catch (err) {
        res.status(500).send('Error al consultar inscripciones por alumno');
    }
});
exports.consultarxCurso = consultarxCurso;
const inscribir = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        return res.render('cargaInscripcion', {
            pagina: 'Crear Inscripcion',
            errores: errores.array(),
        });
    }
    const { estudiante_id, curso_id } = req.body;
    try {
        const estudianteRepository = conexion_1.AppDataSource.getRepository(estudianteModel_1.Estudiante);
        const estudiante = yield estudianteRepository.findOneBy({
            id: estudiante_id,
        });
        if (!estudiante) {
            return res.status(400).json({ mens: 'Estudiante no existe' });
        }
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const curso = yield cursoRepository.findOneBy({ id: curso_id });
        if (!curso) {
            return res.status(400).json({ mens: 'Curso no existe' });
        }
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const inscripcionRepository = transactionalEntityManager.getRepository(cursoEstudianteModel_1.CursoEstudiante);
            const existeInscripcion = yield inscripcionRepository.findOne({
                where: { estudiante_id, curso_id },
                relations: ['estudiante', 'curso'],
            });
            if (existeInscripcion) {
                throw new Error('La inscripción ya existe');
            }
            const nuevaInscripcion = inscripcionRepository.create({
                estudiante_id,
                curso_id,
            });
            yield inscripcionRepository.save(nuevaInscripcion);
        }));
        const inscripciones = yield conexion_1.AppDataSource.getRepository(cursoEstudianteModel_1.CursoEstudiante).find({ relations: ['estudiante', 'curso'] });
        res.render('listarInscripciones', {
            pagina: 'Lista de Inscripciones',
            inscripciones,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
        else {
            res.status(500).send('Error al inscribir al estudiante');
        }
    }
});
exports.inscribir = inscribir;
const cancelarInscripcion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { estudiante_id, curso_id } = req.params;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const inscripcionRepository = transactionalEntityManager.getRepository(cursoEstudianteModel_1.CursoEstudiante);
            const inscripcion = yield inscripcionRepository.findOne({
                where: {
                    estudiante_id: Number(estudiante_id),
                    curso_id: Number(curso_id),
                },
            });
            if (!inscripcion) {
                throw new Error('La inscripción no existe');
            }
            const deleteResult = yield inscripcionRepository.delete({
                estudiante_id: Number(estudiante_id),
                curso_id: Number(curso_id),
            });
            if (deleteResult.affected === 1) {
                return res.json({ mensaje: 'Inscripcion eliminada' });
            }
            else {
                throw new Error('Curso no encontrado');
            }
        }));
        /*const inscripciones = await AppDataSource.getRepository(
          CursoEstudiante
        ).find();
        res.render('listarInscripciones', {
          pagina: 'Lista de Inscripciones',
          inscripciones,
        });*/
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(500).send('Error al cancelar la inscripción');
        }
    }
});
exports.cancelarInscripcion = cancelarInscripcion;
const calificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ mensaje: 'Parada por ahora' });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`Error: ${err.message}`);
        }
    }
});
exports.calificar = calificar;
