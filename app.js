import express from 'express';
import path from 'path';
import { readFileSync } from 'fs';
import { viewsDir, publicDir, dataDir } from './utils/paths.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', viewsDir);
app.use(express.static(publicDir));

// Helper: ler JSON do disco (compatible con calquera versión de Node)
const lerJSON = (nome) =>
  JSON.parse(readFileSync(path.join(dataDir, nome), 'utf-8'));

// Rota de depuración (retirar en produción)
app.get('/_debug', (req, res) => {
  res.json({
    info:        lerJSON('info.json'),
    patroes:     lerJSON('patroes.json'),
    disolucions: lerJSON('disolucions.json'),
    resultados:  lerJSON('resultados.json')
  });
});

app.get('/', (req, res) => {
  res.render('index', { titulo: 'Inicio' });
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});