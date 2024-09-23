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
  check('profesor_id').notEmpty().withMessage('Debe asignar a un profesor'),
  (req: Request, res: Response, next: NextFunction) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.render('creaCursos', {
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

    const cursos = await cursosRepository.find({
      relations: ['profesor'],
    });

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
        relations: ['profesor'],
      });
      if (existeCurso) {
        throw new Error('El curso ya existe.');
      }

      const profesorRepository =
        transactionalEntityManager.getRepository(Profesor);
      const profesor = await profesorRepository.findOne({
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
      await cursoRepository.save(nuevoCurso);
    });
    const cursos = await AppDataSource.getRepository(Curso).find({
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
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    }
  }
};

// Problema no se quiere modificar - se soluciono y no se como  AHHHHHH!!!!
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
        return res.status(404).send('Profesor no encontrado');
      }

      cursoRepository.merge(curso, {
        nombre,
        descripcion,
        profesor,
      });

      await cursoRepository.save(curso);

      return res.redirect('/cursos/listarCursos');
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error al modificar el curso:', err.message);
      return res.status(500).send(`Error del servidor: ${err.message}`);
    } else {
      console.error('Error desconocido:', err);
      return res.status(500).send('Error desconocido');
    }
  }
};

export const eliminar = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    console.log(`ID recibido para eliminar: ${id}`);
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const cursoRepository = transactionalEntityManager.getRepository(Curso);
      const profesorRepository =
        transactionalEntityManager.getRepository(Profesor);

      const profesorRelacionados = await profesorRepository.count({
        where: { id: Number(id) },
      });
      if (profesorRelacionados > 0) {
        throw new Error('Estudiante cursando materias, no se puede eliminar');
      }
      const deleteResult = await cursoRepository.delete(id);

      if (deleteResult.affected === 1) {
        return res.json({ mensaje: 'Curso eliminado' });
      } else {
        throw new Error('Curso no encontrado');
      }
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ mensaje: err.message });
    } else {
      res.status(400).json({ mensaje: 'Error' });
    }
  }
};
