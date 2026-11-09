import express from 'express';
import path from 'path';
import { readFileSync } from 'fs';
import { viewsDir, publicDir, dataDir } from './utils/paths.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', viewsDir);
app.use(express.static(publicDir));

const lerJSON = (nome) =>
  JSON.parse(readFileSync(path.join(dataDir, nome), 'utf-8'));

const info = () => lerJSON('info.json');

const renderPage = (res, opts) => {
  res.render('layout', {
    page: {
      conteudo: opts.conteudo,
      activo:   opts.activo,
      titulo:   opts.titulo || '',
      info:     info(),
      ...opts.extra
    }
  });
};

app.get('/', (req, res) => {
  renderPage(res, { conteudo: 'pages/index', activo: 'inicio', titulo: '' });
});

app.get('/materiais', (req, res) => {
  renderPage(res, { conteudo: 'pages/materiais', activo: 'materiais', titulo: 'Materiais e métodos' });
});

app.get('/resultados', (req, res) => {
  renderPage(res, {
    conteudo: 'pages/resultados',
    activo:   'resultados',
    titulo:   'Resultados',
    extra: {
      patroes:     lerJSON('patroes.json'),
      disolucions: lerJSON('disolucions.json'),
      resultados:  lerJSON('resultados.json')
    }
  });
});

app.get('/conclusions', (req, res) => {
  renderPage(res, { conteudo: 'pages/conclusions', activo: 'conclusions', titulo: 'Conclusións' });
});

app.get('/anexos', (req, res) => {
  renderPage(res, {
    conteudo: 'pages/anexos',
    activo:   'anexos',
    titulo:   'Anexos',
    extra: {
      patroes:     lerJSON('patroes.json'),
      disolucions: lerJSON('disolucions.json'),
      resultados:  lerJSON('resultados.json')
    }
  });
});


app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});