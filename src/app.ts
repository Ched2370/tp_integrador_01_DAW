import cors from 'cors';
import express, { Request, Response } from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';
import path from 'path';
import cursoRouter from './routes/cursosRouter';
import estudianteRouter from './routes/estudianteRouter';
import inscripcionRouter from './routes/inscripcionRouter';
import profesorRouter from './routes/profesorRoutes';

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../public/views'));

app.use(express.static('public'));

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  console.log(__dirname);
  return res.render('index', {
    pagina: 'App Univerdsidad',
    ruta: '/',
    // errores: errores.array()
  });
});
app.use('/estudiantes', estudianteRouter);
app.use('/profesores', profesorRouter);
app.use('/cursos', cursoRouter);
app.use('/inscripciones', inscripcionRouter);

export default app;
