const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
   
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
    type:{
        required: false,
        type: String
    },
    code:{
        required: false,
        type: String
    },
    solde:{
        required: false,
        type: String
    },
    abonnementType:{
        required: false,
        type: String,
        refs:"abonnement"
    }
})

module.exports = mongoose.model('user', dataSchema);
