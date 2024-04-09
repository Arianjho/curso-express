const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/config');
const app = express();
const { routerApi } = require('./routes');

const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');

const port = process.env.PORT || 3000;

app.use(express.json());
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(morgan(':method :url :status - :response-time ms'));

// Esto es para permitir peticiones de otros dominios en especifico
const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hola mi server en express');
});

routerApi(app);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

module.exports = app;
