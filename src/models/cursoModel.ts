import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Estudiante } from './estudianteModel';
import { Profesor } from './profesorModel';

@Entity('cursos')
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('text')
  descripcion: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => Profesor, (profesor) => profesor.cursos)
  @JoinColumn({ name: 'profesor_id' })
  profesor: Profesor;

  @ManyToMany(() => Estudiante)
  @JoinTable({
    name: 'cursos_estudiantes',
    joinColumn: { name: 'curso_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'estudiante_id', referencedColumnName: 'id' },
  })
  estudiantes: Estudiante[];
}
