const { s3Client, PutObjectCommand } = require('../config/aws');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

exports.mp4ToHls = async (req, res) => {
    const AWS_BUCKET_NAME = 'joinup-adventure';
    const folder = 'cursos';
    const curso = decodeURIComponent(req.params.curso);
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    if (file.mimetype !== 'video/mp4') {
        return res.status(400).send('Only mp4 files are allowed.');
    }

    console.log('File uploaded:', file);

    const videoPath = file.path;
    const fileOriginalName = file.originalname.split('.mp4')[0];
    console.log('File name:', fileOriginalName);
    const outputDir = `output/${fileOriginalName}`;
    fs.mkdirSync(outputDir, { recursive: true });

    ffmpeg(videoPath)
        .addOption('-hls_time', 10)
        .addOption('-hls_list_size', 0)
        .output(`${outputDir}/${fileOriginalName}.m3u8`)
        .on('end', async () => {
            console.log('Video conversion finished.');
            const fileList = fs.readdirSync(outputDir);

            for (const fileName of fileList) {
                const fileContent = fs.readFileSync(path.join(outputDir, fileName));
                const params = {
                    Bucket: AWS_BUCKET_NAME,
                    Key: `${folder}/${curso}/${fileOriginalName}/${fileName}`,
                    Body: fileContent
                };

                const command = new PutObjectCommand(params);
                await s3Client.send(command);
                console.log(`File uploaded: ${fileName}`);
            }

            // Delete the output directory and the original video file after uploading the files to S3
            fs.rmSync(outputDir, { recursive: true, force: true });
            fs.unlinkSync(videoPath);
            console.log(`Output directory and original video file deleted: ${outputDir}, ${videoPath}`);

            res.send('Video uploaded and processed.');
        })
        .on('error', (err) => {
            console.error('Error: ', err);
            res.status(500).send('Error during the conversion process.');

            // Delete the output directory and the original video file if an error occurs
            fs.rmSync(outputDir, { recursive: true, force: true });
            fs.unlinkSync(videoPath);
            console.log(`Output directory and original video file deleted: ${outputDir}, ${videoPath}`);
        })
        .run();
}