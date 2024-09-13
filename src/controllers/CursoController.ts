import { Request, Response} from 'express';
import { AppDataSource } from '../db/conexion';
import { Curso } from '../models/cursoModel';
import { Profesor } from '../models/profesorModel';


class CursoController{

    

    async consultarTodos(req:Request, res:Response){
        try {
            const cursoRepository = AppDataSource.getRepository(Curso);
            const cursos =  await cursoRepository.find({ relations: ["profesor"] });
            res.status(200).json(cursos);
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).send(err.message);
            }
        }
    }

    async consultarUno(req:Request, res:Response){
        const {id}=req.params;
        
        try {
            const cursoRepository = AppDataSource.getRepository(Curso);
            const curso = await cursoRepository.findOne({
                where: { id: parseInt(req.params.id) },
                relations: ["profesor"]
            });
            if (curso) {
                res.status(200).json(curso);
            } else {
                res.status(400).json({ mensaje: 'Curso no encontrado' });
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).send(err.message);
            }
        }
    }

    async insertar(req:Request, res:Response){
        const { nombre, descripcion, profesor_id } = req.body;

        try {
            await AppDataSource.transaction(async transactionalEntityManager => {
               
                const profesor = await transactionalEntityManager.findOne(Profesor, { where: { id: profesor_id } });

                if (!profesor) {
                    return res.status(400).json({ mensaje: 'El profesor no existe' });
                }

                
                const nuevoCurso = new Curso();
                nuevoCurso.nombre = nombre;
                nuevoCurso.descripcion = descripcion;
                nuevoCurso.profesor = profesor; // Relacionar con el objeto profesor obtenido

                const cursoInsertado = await transactionalEntityManager.save(nuevoCurso);
                
                res.status(200).json({ id: cursoInsertado.id });
            });
        } 
        catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).send(err.message);
            }
        }
    }

    async modificar(req: Request, res: Response) {
        const { id } = req.params;
        const { nombre, descripcion, profesor_id } = req.body;
    
        try {
            await AppDataSource.transaction(async transactionalEntityManager => {
                // Verificar si el profesor existe
                const profesor = await transactionalEntityManager.findOne(Profesor, { where: { id: profesor_id } }); 
                if (!profesor) {
                    return res.status(400).json({ mensaje: 'El profesor no existe' });
                } 
                // Verificar si el curso existe
                const curso = await transactionalEntityManager.findOne(Curso, { where: { id: parseInt(id, 10) } });
                if (!curso) {
                    return res.status(404).json({ mensaje: 'El curso no existe' });
                }
                // Actualizar el curso utilizando merge
                transactionalEntityManager.merge(Curso, curso, {
                    nombre,
                    descripcion,
                    profesor,
                });
    
                // Guardar los cambios
                const cursoActualizado = await transactionalEntityManager.save(curso);
                res.status(200).json({ curso: cursoActualizado });
            });
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(500).send(err.message);
            }
        }
    }
    
    

    async eliminar(req:Request, res:Response){
        const {id}=req.params;
        try {
            const cursoRepository = AppDataSource.getRepository(Curso);
            const curso = await cursoRepository.findOne({ where: { id: parseInt(id, 10) } });
            if (!curso) {
                return res.status(404).json({ mensaje: 'El curso no existe' });
            }
            await cursoRepository.remove(curso);
            res.status(200).json({ mensaje: 'Curso eliminado correctamente' });
        }
        catch(err){
            if (err instanceof Error){
               res.status(500).send(err.message);
            }
        }
    }

}
export default new CursoController();