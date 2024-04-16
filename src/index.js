const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
/* require('./config/database'); */
/* const apiKeyVerify = require('./middleware/apiKey'); */

const app = express();
app.use(cors());
app.use(bodyParser.json());
/* app.use(apiKeyVerify); */

const greetingRouter = require('./routes/greeting');
app.use('/greeting', greetingRouter);

const videoHlsRouter = require('./routes/videoHls');
app.use('/video-hls', videoHlsRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});