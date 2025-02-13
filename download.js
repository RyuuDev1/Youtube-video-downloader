import ytdl from 'ytdl-core';

export default async (req, res) => {
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

    res.setHeader('Content-Disposition', `attachment; filename="video-${quality}p.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');
    
    ytdl(url, { format }).pipe(res);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Download failed', message: error.message });
  }
};
