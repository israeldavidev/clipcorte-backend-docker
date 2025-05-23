const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  const { videoUrl, theme } = req.body;
  if (!videoUrl || !theme) {
    return res.status(400).json({ error: 'Missing videoUrl or theme' });
  }

  // Simulação de resposta
  res.json({ message: 'Processamento iniciado!', videoUrl, theme });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
