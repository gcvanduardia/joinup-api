const { s3Client, GetObjectCommand } = require('../config/aws');

exports.streamVideoHlsFromS3 = async (req, res) => {
    const curso = decodeURIComponent(req.params.curso);
    const folder = decodeURIComponent(req.params.folder);
    const video = decodeURIComponent(req.params.video);

    const streamParams = {
        Bucket: 'joinup-adventure',
        Key: `cursos/${curso}/${folder}/${video}`
    };

    console.log('streamParams:', streamParams);

    try {
        const streamData = await s3Client.send(new GetObjectCommand(streamParams));
        const contentType = streamData.ContentType;
        res.writeHead(200, {
            'Content-Type': contentType,
        });

        streamData.Body.pipe(res);
    } catch (e) {
        console.error('Error streaming video:', e);
        res.status(500).send('Error al transmitir el video');
    }
}