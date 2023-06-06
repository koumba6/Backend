const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
   
    prenom: {
        required: false,
        type: String
    },
    nom: {
        required: false,
        type: String
    },
    email: {
        required: false,
        type: String
    },
    password:{
        required: false,
        type: String
    },
    
})

module.exports = mongoose.model('amdin', adminSchema);
