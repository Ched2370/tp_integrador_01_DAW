import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { AppDataSource } from '../db/conexion';
import { CursoEstudiante } from '../models/cursoEstudianteModel';
import { Curso } from '../models/cursoModel';
import { Estudiante } from '../models/estudianteModel';

var inscripciones: CursoEstudiante[];

export const validar = () => [
  check('estudiante_id')
    .notEmpty()
    .isNumeric()
    .withMessage('Debe agregar ID del estudiante'),
  check('curso_id')
    .notEmpty()
    .isNumeric()
    .withMessage('Debe agregar ID del curso'),
  (req: Request, res: Response, next: NextFunction) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.render('creaInscripciones', {
        pagina: 'Crear Inscripcion',
        //errores: errores.array(),
      });
    }
    next();
  },
];

export const consultarTodos = async (req: Request, res: Response) => {
  try {
    const inscripcionesRepository =
      AppDataSource.getRepository(CursoEstudiante);
    const inscripciones = await inscripcionesRepository.find({
      relations: ['estudiante', 'curso'],
    });
    res.render('listarInscripciones', {
      pagina: 'Listar de Inscripciones',
      varnav: 'listar',
      inscripciones,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send('Error al consultar las inscripciones');
    }
  }
};

export const consultarxAlumno = async (req: Request, res: Response) => {
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
    res.status(200).json(inscripcion);
  } catch (err) {
    res.status(500).send('Error al consultar inscripciones por alumno');
  }
};

export const consultarxCurso = async (req: Request, res: Response) => {
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
    res.status(200).json(inscripcion);
  } catch (err) {
    res.status(500).send('Error al consultar inscripciones por alumno');
  }
};

export const inscribir = async (req: Request, res: Response) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render('cargaInscripcion', {
      pagina: 'Crear Inscripcion',
      errores: errores.array(),
    });
  }

  const { estudiante_id, curso_id } = req.body;

  try {
    const estudianteRepository = AppDataSource.getRepository(Estudiante);
    const estudiante = await estudianteRepository.findOneBy({
      id: estudiante_id,
    });
    if (!estudiante) {
      return res.status(400).json({ mens: 'Estudiante no existe' });
    }

    const cursoRepository = AppDataSource.getRepository(Curso);
    const curso = await cursoRepository.findOneBy({ id: curso_id });
    if (!curso) {
      return res.status(400).json({ mens: 'Curso no existe' });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const inscripcionRepository =
        transactionalEntityManager.getRepository(CursoEstudiante);
      const existeInscripcion = await inscripcionRepository.findOne({
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

      await inscripcionRepository.save(nuevaInscripcion);
    });

    const inscripciones = await AppDataSource.getRepository(
      CursoEstudiante
    ).find({ relations: ['estudiante', 'curso'] });
    res.render('listarInscripciones', {
      pagina: 'Lista de Inscripciones',
      inscripciones,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send('Error al inscribir al estudiante');
    }
  }
};

export const cancelarInscripcion = async (req: Request, res: Response) => {
  const { estudiante_id, curso_id } = req.params;

  try {
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const inscripcionRepository =
        transactionalEntityManager.getRepository(CursoEstudiante);

      const inscripcion = await inscripcionRepository.findOne({
        where: {
          estudiante_id: Number(estudiante_id),
          curso_id: Number(curso_id),
        },
      });

      if (!inscripcion) {
        throw new Error('La inscripción no existe');
      }

      const deleteResult = await inscripcionRepository.delete({
        estudiante_id: Number(estudiante_id),
        curso_id: Number(curso_id),
      });

      if (deleteResult.affected === 1) {
        return res.json({ mensaje: 'Inscripcion eliminada' });
      } else {
        throw new Error('Curso no encontrado');
      }
    });

    /*const inscripciones = await AppDataSource.getRepository(
      CursoEstudiante
    ).find();
    res.render('listarInscripciones', {
      pagina: 'Lista de Inscripciones',
      inscripciones,
    });*/
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).send('Error al cancelar la inscripción');
    }
  }
};

export const calificar = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ mensaje: 'Parada por ahora' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send(`Error: ${err.message}`);
    }
  }
};
