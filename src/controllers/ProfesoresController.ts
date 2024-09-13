import { Request, Response } from 'express';
import { Profesor } from '../models/profesorModel';
import { AppDataSource } from '../db/conexion';
import { Curso } from '../models/cursoModel';

class ProfesorController {
    
    async consultarTodos(req: Request, res: Response): Promise<void> {
        try {
            const profesorRepository = AppDataSource.getRepository(Profesor);
            const profesores = await profesorRepository.find();
            res.status(200).json(profesores);
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).send(err.message);
            }
        }
    }
    async consultarUno(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const profesorRepository = AppDataSource.getRepository(Profesor);
            const profesor = await profesorRepository.findOne({ where: { id: Number(id) } });

            if (profesor) {
                res.status(200).json(profesor);
            } else {
                res.status(400).json({ mensaje: 'Profesor no encontrado' });
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).send(err.message);
            }
        }
    }
    async insertar(req: Request, res: Response): Promise<void> {
        const { dni, nombre, apellido, email, profesion, telefono } = req.body;
        try {
            const profesorRepository  =  AppDataSource.getRepository(Profesor);
            const nuevoProfesor= profesorRepository.create({ dni, nombre, apellido, email, profesion, telefono});
            const resultado = await profesorRepository.save(nuevoProfesor);
            res.status(201).json({ id: resultado.id });
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).send(err.message);
            }
        }
    }
   async modificar (req: Request, res: Response): Promise<void> {
    try {
        const profesorRepository = AppDataSource.getRepository(Profesor);   
        const profesor = await profesorRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!profesor) {
            throw new Error('Profesor no encontrado');
        }   
        profesorRepository.merge(profesor, req.body);
        const result = await profesorRepository.save(profesor);
        res.json(result);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(404).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Error' });
        }
    }
   }    
    async eliminar(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            await AppDataSource.transaction(async transactionalEntityManager => {
                const cursoRepository = transactionalEntityManager.getRepository(Curso);
                const profesorRepository = transactionalEntityManager.getRepository(Profesor);

                const cursosRelacionados = await cursoRepository.count({ where: { profesor: { id: Number(id) } } });

                if (cursosRelacionados > 0) {
                    throw new Error('Profesor dictando materias, no se puede eliminar');
                }

                const deleteResult = await profesorRepository.delete(id);

                if (deleteResult.affected === 1) {
                    res.status(200).json({ mensaje: 'Profesor eliminado' });
                } else {
                    throw new Error('Profesor no encontrado');
                }
            });
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(400).json({ mensaje: err.message });
            } else {
                res.status(400).json({ mensaje: 'Error' });
            }
        }
    }
}
export default new ProfesorController();