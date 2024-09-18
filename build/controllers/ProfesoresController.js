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
const profesorModel_1 = require("../models/profesorModel");
var profesores;
const validar = () => [
    (0, express_validator_1.check)('dni')
        .notEmpty()
        .withMessage('El DNI es obligatorio')
        .isLength({ min: 7 })
        .withMessage('El DNI debe tener al menos 7 caracteres'),
    (0, express_validator_1.check)('nombre')
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isLength({ min: 3 })
        .withMessage('El Nombre debe tener al menos 3 caracteres'),
    (0, express_validator_1.check)('apellido')
        .notEmpty()
        .withMessage('El apellido es obligatorio')
        .isLength({ min: 3 })
        .withMessage('El Apellido debe tener al menos 3 caracteres'),
    (0, express_validator_1.check)('email').isEmail().withMessage('Debe proporcionar un email válido'),
    (0, express_validator_1.check)('profesion')
        .notEmpty()
        .withMessage('Debe proporcionar u na profesion válido'),
    (0, express_validator_1.check)('telefono')
        .notEmpty()
        .withMessage('Debe proporcionar un telefono válido'),
    (req, res, next) => {
        const errores = (0, express_validator_1.validationResult)(req);
        if (!errores.isEmpty()) {
            return res.render('creaProfesor', {
                pagina: 'Crear Profesor',
                errores: errores.array(),
            });
        }
        next();
    },
];
exports.validar = validar;
const consultarTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesoresRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        console.log('rede');
        profesores = yield profesoresRepository.find();
        res.render('listarProfesores', {
            pagina: 'Lista de Profesores',
            varnav: 'listar',
            profesores,
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
        throw new Error('ID inválido, debe ser un número');
    }
    try {
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        const profesor = yield profesorRepository.findOne({
            where: { id: idNumber },
        });
        if (profesor) {
            return profesor;
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
        return res.render('cargaProfesores', {
            pagina: 'Crear Profesor',
            errores: errores.array(),
        });
    }
    const { dni, nombre, apellido, email, profesion, telefono } = req.body;
    try {
        yield conexion_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
            const profesorRepository = transactionalEntityManager.getRepository(profesorModel_1.Profesor);
            const existeProfesor = yield profesorRepository.findOne({
                where: [{ dni }, { email }],
            });
            if (existeProfesor) {
                throw new Error('El estudiante ya existe.');
            }
            const nuevoProfesor = profesorRepository.create({
                dni,
                nombre,
                apellido,
                email,
                profesion,
                telefono,
            });
            yield profesorRepository.save(nuevoProfesor);
        }));
        const profesores = yield conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor).find();
        res.render('listarProfesores', {
            pagina: 'Lista de Profesores',
            profesores,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).send(err.message);
        }
    }
});
exports.insertar = insertar;
/* Seguir desde aca */
const modificar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { dni, nombre, apellido, email, profesion, telefono } = req.body;
    try {
        const profesorRepository = conexion_1.AppDataSource.getRepository(profesorModel_1.Profesor);
        const profesor = yield profesorRepository.findOne({
            where: { id: parseInt(id) },
        });
        if (!profesor) {
            return res.status(404).send('Profesor no encontrado');
        }
        profesorRepository.merge(profesor, {
            dni,
            nombre,
            apellido,
            email,
            profesion,
            telefono,
        });
        yield profesorRepository.save(profesor);
        return res.redirect('/profesores/listarProfesores');
    }
    catch (error) {
        console.error('Error al modificar el profesor:', error);
        return res.status(500).send('Error del servidor');
    }
});
exports.modificar = modificar;
const eliminar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        console.log(`ID recibido para eliminar: ${id}`);
        /*await AppDataSource.transaction(async (transactionalEntityManager) => {
          const cursosEstudiantesRepository =
            transactionalEntityManager.getRepository(CursoEstudiante);
          const estudianteRepository =
            transactionalEntityManager.getRepository(Estudiante);
    
          const cursosRelacionados = await cursosEstudiantesRepository.count({
            where: { estudiante: { id: Number(id) } },
          });
          if (cursosRelacionados > 0) {
            throw new Error('Estudiante cursando materias, no se puede eliminar');
          }
          const deleteResult = await estudianteRepository.delete(id);
    
          if (deleteResult.affected === 1) {
            return res.json({ mensaje: 'Estudiante eliminado' });
          } else {
            throw new Error('Estudiante no encontrado');
          }
        });*/
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
