import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Curso } from './cursoModel';
import { Estudiante } from './estudianteModel';

@Entity('cursos_estudiantes')
export class CursoEstudiante {
  @PrimaryColumn()
  public estudiante_id: number;

  @PrimaryColumn()
  public curso_id: number;

  @Column({ type: 'float', default: () => 0 })
  public nota: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public fecha: Date;

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.cursos)
  @JoinColumn({ name: 'estudiante_id' })
  public estudiante: Estudiante;

  @ManyToOne(() => Curso, (curso) => curso.estudiantes)
  @JoinColumn({ name: 'curso_id' })
  public curso: Curso;
}
