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
exports.eliminar = exports.modificar = exports.insertar = exports.consultarUno = exports.consultarTodos = exports.validar = void 0;
const express_validator_1 = require("express-validator");
const conexion_1 = require("../db/conexion");
const cursoModel_1 = require("../models/cursoModel");
const profesorModel_1 = require("../models/profesorModel");
var cursos;
const validar = () => [
    (0, express_validator_1.check)('nombre')
        .notEmpty()
        .withMessage('El nombre del curso es obligatorio')
        .isLength({ min: 2 })
        .withMessage('El nombre del curso debe tener al menos 2 caracteres'),
    (0, express_validator_1.check)('profesor_id').notEmpty().withMessage('Debe asignar a un profesor'),
    (req, res, next) => {
        const errores = (0, express_validator_1.validationResult)(req);
        if (!errores.isEmpty()) {
            return res.render('creaCursos', {
                pagina: 'Crea Curso',
                errores: errores.array(),
            });
        }
        next();
    },
];
exports.validar = validar;
const consultarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursosRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const cursos = yield cursosRepository.find({
            relations: ['profesor'],
        });
        res.render('listarCursos', {
            pagina: 'Lista de cursos',
            varnav: 'listar',
            cursos,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.consultarTodos = consultarTodos;
const consultarUno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
        throw new Error('ID invalido, debe ser un numero');
    }
    try {
        const cursoRepository = conexion_1.AppDataSource.getRepository(cursoModel_1.Curso);
        const curso = yield cursoRepository.findOne({
            where: { id: idNumber },
        });
        if (curso) {
            return curso;
        }
        else {
            return null;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        else {
            throw new Error('Error desconocido');
        }
    }
});
exports.consultarUno = consultarUno;
const insertar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        return res.render('cargaCursos', {
            pagina: 'Crear Curso',
            errores: errores.array(),
        });
    }
    const { nombre, descripcion, profesor_id } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursoRepository = transactionalEntityManager.getRepository(cursoModel_1.Curso);
            const existeCurso = yield cursoRepository.findOne({
                where: { nombre },
                relations: ['profesor'],
            });
            if (existeCurso) {
                throw new Error('El curso ya existe.');
            }
            const profesorRepository = transactionalEntityManager.getRepository(profesorModel_1.Profesor);
            const profesor = yield profesorRepository.findOne({
                where: { id: profesor_id },
            });
            if (!profesor) {
                throw new Error('Profesor no encontrado.');
            }
            const nuevoCurso = cursoRepository.create({
                nombre,
                descripcion,
                profesor,
            });
            yield cursoRepository.save(nuevoCurso);
        }));
        const cursos = yield conexion_1.AppDataSource.getRepository(cursoModel_1.Curso).find({
            relations: ['profesor'],
        });
        // Filtrar cursos sin profesor
        const cursosFiltrados = cursos.filter((curso) => curso.profesor);
        res.render('listarCursos', {
            pagina: 'Lista de cursos',
            cursos: cursosFiltrados,
        });
        res.render('listarCursos', {
            pagina: 'Lista de cursos',
            cursos,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.insertar = insertar;
// Problema no se quiere modificar - se soluciono y no se como  AHHHHHH!!!!
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, descripcion, profesor_id } = req.body;
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
        return res.status(400).send('ID inválido');
    }
    const profesorIdNumber = parseInt(profesor_id);
    if (isNaN(profesorIdNumber)) {
        return res.status(400).send('ID del profesor inválido');
    }
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursoRepository = transactionalEntityManager.getRepository(cursoModel_1.Curso);
            const curso = yield cursoRepository.findOne({
                where: { id: idNumber },
            });
            if (!curso) {
                return res.status(404).send('Curso no encontrado');
            }
            const profesorRepository = transactionalEntityManager.getRepository(profesorModel_1.Profesor);
            const profesor = yield profesorRepository.findOne({
                where: { id: profesorIdNumber },
            });
            if (!profesor) {
                return res.status(404).send('Profesor no encontrado');
            }
            cursoRepository.merge(curso, {
                nombre,
                descripcion,
                profesor,
            });
            yield cursoRepository.save(curso);
            return res.redirect('/cursos/listarCursos');
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            console.error('Error al modificar el curso:', err.message);
            return res.status(500).send(`Error del servidor: ${err.message}`);
        }
        else {
            console.error('Error desconocido:', err);
            return res.status(500).send('Error desconocido');
        }
    }
});
exports.modificar = modificar;
const eliminar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        console.log(`ID recibido para eliminar: ${id}`);
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const cursoRepository = transactionalEntityManager.getRepository(cursoModel_1.Curso);
            const profesorRepository = transactionalEntityManager.getRepository(profesorModel_1.Profesor);
            const profesorRelacionados = yield profesorRepository.count({
                where: { id: Number(id) },
            });
            if (profesorRelacionados > 0) {
                throw new Error('Estudiante cursando materias, no se puede eliminar');
            }
            const deleteResult = yield cursoRepository.delete(id);
            if (deleteResult.affected === 1) {
                return res.json({ mensaje: 'Curso eliminado' });
            }
            else {
                throw new Error('Curso no encontrado');
            }
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ mensaje: err.message });
        }
        else {
            res.status(400).json({ mensaje: 'Error' });
        }
    }
});
exports.eliminar = eliminar;
