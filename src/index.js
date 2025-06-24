const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./config/database');
/* const apiKeyVerify = require('./middleware/apiKey'); */

const app = express();
app.use(cors());
app.use(bodyParser.json());
/* app.use(apiKeyVerify); */

const cursosRouter = require('./routes/cursos');
app.use('/cursos', cursosRouter);

const userRouter = require('./routes/user');
app.use('/user', userRouter);

const greetingRouter = require('./routes/greeting');
app.use('/greeting', greetingRouter);

const videoHlsRouter = require('./routes/videoHls');
app.use('/video-hls', videoHlsRouter);

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const mp4ToHlsRouter = require('./routes/mp4ToHls');
app.use('/mp4-to-hls', mp4ToHlsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});