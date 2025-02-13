const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  methods: ['POST', 'GET'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Download endpoint
app.post('/api/download', async (req, res) => {
  try {
    const { url, quality } = req.body;
    
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, {
      quality: quality + 'p',
      filter: 'audioandvideo'
    });

    res.header({
      'Content-Disposition': `attachment; filename="video-${quality}p.mp4"`,
      'Content-Type': 'video/mp4'
    });

    ytdl(url, { format }).pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: 'Download failed',
      message: error.message 
    });
  }
});

// Handle production port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
