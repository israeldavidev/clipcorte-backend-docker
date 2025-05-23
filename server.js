const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const supabase = createClient(
  'https://sidylbemesotxeaxhloi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZHlsYmVtZXNvdHhlYXhobG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODI1OTQsImV4cCI6MjA2MzQ1ODU5NH0.AtNXEnGQW1NhHqqhzUwyZiF431sARx-1IqukAq0U3G8'
);

app.post('/generate', async (req, res) => {
  const { videoUrl, theme, userId } = req.body;

  if (!videoUrl || !theme || !userId) {
    return res.status(400).json({ error: 'Missing videoUrl, theme or userId' });
  }

  const videoId = uuidv4();
  const outputPath = `/tmp/${videoId}.mp4`;
  const finalPath = `/tmp/${videoId}_final.mp4`;

  try {
    // Baixar o vídeo do YouTube
    await execPromise(`yt-dlp -o "${outputPath}" "${videoUrl}"`);

    // Converter para 9:16 (vertical)
    await execPromise(`ffmpeg -i "${outputPath}" -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" -c:a copy "${finalPath}" -y`);

    // Ler arquivo
    const fileBuffer = fs.readFileSync(finalPath);
    const fileName = `${videoId}.mp4`;

    // Enviar para o Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(fileName, fileBuffer, {
        contentType: 'video/mp4',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // Gerar URL pública
    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);

    // Inserir no banco de dados
    await supabase.from('videos').insert({
      user_id: userId,
      title: `Corte de ${videoId}`,
      description: `Estilo ${theme}`,
      file_path: fileName,
      status: 'completed'
    });

    // Limpar arquivos temporários
    fs.unlinkSync(outputPath);
    fs.unlinkSync(finalPath);

    return res.json({
      message: 'Vídeo processado com sucesso!',
      url: publicUrlData.publicUrl
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao processar vídeo.' });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}
