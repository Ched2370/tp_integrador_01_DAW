import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { AppDataSource } from '../db/conexion';
import { Profesor } from '../models/profesorModel';

var profesores: Profesor[];

export const validar = () => [
  check('dni')
    .notEmpty()
    .withMessage('El DNI es obligatorio')
    .isLength({ min: 7 })
    .withMessage('El DNI debe tener al menos 7 caracteres'),
  check('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 3 })
    .withMessage('El Nombre debe tener al menos 3 caracteres'),
  check('apellido')
    .notEmpty()
    .withMessage('El apellido es obligatorio')
    .isLength({ min: 3 })
    .withMessage('El Apellido debe tener al menos 3 caracteres'),
  check('email').isEmail().withMessage('Debe proporcionar un email válido'),
  check('profesion')
    .notEmpty()
    .withMessage('Debe proporcionar u na profesion válido'),
  check('telefono')
    .notEmpty()
    .withMessage('Debe proporcionar un telefono válido'),
  (req: Request, res: Response, next: NextFunction) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.render('creaProfesor', {
        pagina: 'Crear Profesor',
        errores: errores.array(),
      });
    }
    next();
  },
];

export const consultarTodos = async (req: Request, res: Response) => {
  try {
    const profesoresRepository = AppDataSource.getRepository(Profesor);
    console.log('rede');
    profesores = await profesoresRepository.find();
    res.render('listarProfesores', {
      pagina: 'Lista de Profesores',
      varnav: 'listar',
      profesores,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
};

export const consultarUno = async (
  req: Request,
  res: Response
): Promise<Profesor | null> => {
  const { id } = req.params;
  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    throw new Error('ID inválido, debe ser un número');
  }

  try {
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesor = await profesorRepository.findOne({
      where: { id: idNumber },
    });

    if (profesor) {
      return profesor;
    } else {
      return null;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error('Error desconocido');
    }
  }
};

export const insertar = async (req: Request, res: Response) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render('cargaProfesores', {
      pagina: 'Crear Profesor',
      errores: errores.array(),
    });
  }

  const { dni, nombre, apellido, email, profesion, telefono } = req.body;

  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const profesorRepository =
        transactionalEntityManager.getRepository(Profesor);
      const existeProfesor = await profesorRepository.findOne({
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
      await profesorRepository.save(nuevoProfesor);
    });
    const profesores = await AppDataSource.getRepository(Profesor).find();
    res.render('listarProfesores', {
      pagina: 'Lista de Profesores',
      profesores,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
};

/* Seguir desde aca */
export const modificar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { dni, nombre, apellido, email, profesion, telefono } = req.body;
  try {
    const profesorRepository = AppDataSource.getRepository(Profesor);
    const profesor = await profesorRepository.findOne({
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
    await profesorRepository.save(profesor);
    return res.redirect('/profesores/listarProfesores');
  } catch (error) {
    console.error('Error al modificar el profesor:', error);
    return res.status(500).send('Error del servidor');
  }
};

export const eliminar = async (req: Request, res: Response): Promise<void> => {
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ mensaje: err.message });
    } else {
      res.status(400).json({ mensaje: 'Error' });
    }
  }
};
