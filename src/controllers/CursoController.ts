import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { AppDataSource } from '../db/conexion';
import { Curso } from '../models/cursoModel';
import { Profesor } from '../models/profesorModel';

var cursos: Curso[];

export const validar = () => [
  check('nombre')
    .notEmpty()
    .withMessage('El nombre del curso es obligatorio')
    .isLength({ min: 2 })
    .withMessage('El nombre del curso debe tener al menos 2 caracteres'),
  check('descripcion')
    .notEmpty()
    .withMessage('Ingrese una descripcion del curso')
    .isLength({ min: 15 })
    .withMessage('La descripcion del curso debe tener al menos 15 caracteres'),
  (req: Request, res: Response, next: NextFunction) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.render('creaCurso', {
        pagina: 'Crea Curso',
        errores: errores.array(),
      });
    }
    next();
  },
];

export const consultarTodos = async (req: Request, res: Response) => {
  try {
    const cursosRepository = AppDataSource.getRepository(Curso);
    console.log('rede');
    cursos = await cursosRepository.find();
    res.render('listarCursos', {
      pagina: 'Lista de cursos',
      varnav: 'listar',
      cursos,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
};

export const consultarUno = async (
  req: Request,
  res: Response
): Promise<Curso | null> => {
  const { id } = req.params;
  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    throw new Error('ID invalido, debe ser un numero');
  }
  try {
    const cursoRepository = AppDataSource.getRepository(Curso);
    const curso = await cursoRepository.findOne({
      where: { id: idNumber },
    });
    if (curso) {
      return curso;
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
    return res.render('cargaCursos', {
      pagina: 'Crear Curso',
      errores: errores.array(),
    });
  }

  const { nombre, descripcion, profesor_id } = req.body;
  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const cursoRepository = transactionalEntityManager.getRepository(Curso);
      const existeCurso = await cursoRepository.findOne({
        where: { nombre },
      });
      if (existeCurso) {
        throw new Error('El curso ya existe.');
      }

      const profesorRepository =
        transactionalEntityManager.getRepository(Profesor);
      const profesor = await profesorRepository.findOne({
        where: { id: profesor_id },
      });
      if (profesor) {
        console.log(profesor.nombre);
      }
      if (!profesor) {
        throw new Error('Profesor no encontrado.');
      }
      const nuevoCurso = cursoRepository.create({
        nombre,
        descripcion,
        profesor,
      });
      await cursoRepository.save(nuevoCurso);
    });
    const cursos = await AppDataSource.getRepository(Curso).find();
    res.render('listarCursos', {
      pagina: 'Lista de cursos',
      cursos,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
};

// sigo de aca
export const modificar = async (req: Request, res: Response) => {
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
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const cursoRepository = transactionalEntityManager.getRepository(Curso);
      const curso = await cursoRepository.findOne({
        where: { id: idNumber },
      });

      if (!curso) {
        return res.status(404).send('Curso no encontrado');
      }

      const profesorRepository =
        transactionalEntityManager.getRepository(Profesor);
      const profesor = await profesorRepository.findOne({
        where: { id: profesorIdNumber },
      });

      if (!profesor) {
        throw new Error('Profesor no encontrado.');
      }

      cursoRepository.merge(curso, {
        nombre,
        descripcion,
        profesor, // Asignamos el objeto profesor directamente
      });

      await cursoRepository.save(curso);
      return res.redirect('/cursos/listarCursos');
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error al modificar el profesor:', err.message);
      return res.status(500).send(`Error del servidor: ${err.message}`);
    }
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
