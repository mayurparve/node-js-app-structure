const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
//Load env variables from our custom path
dotenv.config({ path: './config/config.env' });

//Middlewares
const errorHandler = require('./middleware/error')
const { protect, authorize } = require('./middleware/auth')

//Routes files
const authRoute = require('./routes/auth')
const tasksRoute = require('./routes/tasks')

//Request logger
const morgan = require('morgan');

const app = express();
app.use(compression()); //Compress all routes
app.use(helmet());
app.use(helmet.xssFilter());
app.use(cors());
app.use(express.static('public'))
//Body parser
app.use(express.json());
//Cookie parser
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Routes
app.use('/auth', authRoute);
app.use('/tasks', protect, authorize('Admin'), tasksRoute);

//Error Handler
app.use(errorHandler);

const db = require('./models');
db.sequelize.sync()
    .then(() => {
        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
        });
    })
    .catch(err => console.log(err));

