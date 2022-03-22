const mongoose = require('mongoose');

// connecting to database
mongoose.connect('mongodb://localhost:27017/BIM-api', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to database successfully');
}).catch(() => {
    console.log('ERROR : unable to connect to database');
});
