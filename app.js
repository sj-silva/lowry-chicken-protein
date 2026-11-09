import express from 'express';
import { viewsDir, publicDir } from './utils/paths.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', viewsDir);

// Estáticos
app.use(express.static(publicDir));

// Ruta de proba
app.get('/', (req, res) => {
  res.render('index', { titulo: 'Inicio' });
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});