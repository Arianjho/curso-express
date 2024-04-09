const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const app = express();
const { routerApi } = require('./routes');

const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');

const port = process.env.PORT || 3000;

app.use(express.json());
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(morgan(':method :url :status - :response-time ms'));

// Esto es para permitir peticiones de otros dominios en especifico
const whitelist = ['http://localhost:8080', 'https://myapp.com'];
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

const swaggerOptions = {
  openapi: '3.0.0',
  definition: {
    info: {
      title: 'API Catalogo de Productos',
      version: '1.0.0',
      description: 'Una simple API para un catalogo de productos'
    },
    servers: [
      {
        url: 'https://curso-express-production.up.railway.app/api/v1'
      }
    ]
  },
  apis: ['./*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

module.exports = app;
