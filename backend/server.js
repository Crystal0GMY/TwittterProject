const express = require('express');
const status = require('./apis/status.route');
const user = require('./apis/user.route');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/status', status);
app.use('/api/user', user);


const mongoEndpoint = "mongodb+srv://meiyi0guang:990104@cluster0.i2e12.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoEndpoint, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT || 3000, () => {
            console.log('Server started');
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

