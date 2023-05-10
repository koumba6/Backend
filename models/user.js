const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
   
   
    email: {
        required: false,
        type: String
    },
    password:{
        required: false,
        type: String
    }
})

module.exports = mongoose.model('user', dataSchema);