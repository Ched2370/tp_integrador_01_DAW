import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { AppDataSource } from '../db/conexion';
import { CursoEstudiante } from '../models/cursoEstudianteModel';

var inscripciones: CursoEstudiante[];

// Validaciones
export const validar = () => [
  check('estudiante_id')
    .notEmpty()
    .withMessage('Debe agregar el ID del estudiante')
    .isNumeric()
    .withMessage('Debe ser un número'),
  check('curso_id')
    .notEmpty()
    .withMessage('Debe agregar el ID del curso')
    .isNumeric()
    .withMessage('Debe ser un número'),
  (req: Request, res: Response, next: NextFunction) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.render('creaInscripciones', {
        pagina: 'Crea Inscripción',
        errores: errores.array(),
      });
    }
    next();
  },
];

// Consultar todas las inscripciones
export const consultarTodos = async (req: Request, res: Response) => {
  try {
    const inscripcionesRepository =
      AppDataSource.getRepository(CursoEstudiante);
    inscripciones = await inscripcionesRepository.find();

    res.render('listarInscripciones', {
      pagina: 'Lista de inscripciones',
      varnav: 'listar',
      inscripciones,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).send(err.message);
    }
  }
};

// Consultar inscripción por alumno
export const consultarxAlumno = async (
  req: Request,
  res: Response
): Promise<CursoEstudiante | null> => {
  const { id } = req.params;
  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    throw new Error('ID inválido, debe ser un número');
  }

  try {
    const inscripcionRepository = AppDataSource.getRepository(CursoEstudiante);
    const inscripcion = await inscripcionRepository.findOne({
      where: { estudiante_id: idNumber },
    });

    return inscripcion || null;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Error desconocido');
  }
};

export const consultarxCurso = async (
  req: Request,
  res: Response
): Promise<CursoEstudiante | null> => {
  const { id } = req.params;
  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    throw new Error('ID inválido, debe ser un número');
  }

  try {
    const inscripcionRepository = AppDataSource.getRepository(CursoEstudiante);
    const inscripcion = await inscripcionRepository.findOne({
      where: { curso_id: idNumber },
    });

    return inscripcion || null;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Error desconocido');
  }
};
