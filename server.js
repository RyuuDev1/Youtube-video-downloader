const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
    try {
        const { url, quality } = req.body;
        if (!ytdl.validateURL(url)) {
            return res.status(400).send('Invalid YouTube URL');
        }

        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, {
            quality: quality + 'p',
            filter: 'audioandvideo'
        });

        res.header({
            'Content-Disposition': `attachment; filename="video.mp4"`,
            'Content-Type': 'video/mp4'
        });

        ytdl(url, { format: format }).pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).send('Download failed');
    }
});

app.listen(8080, () => {
    console.log('Server running on port 8080');
});
