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
    codeacces: {
        required: false,
        type: String
    },
    Type: {
        required: false,
        type: String
    },
    prix: {
        required: false,
        type: String
    },
    description: {
        required: false,
        type: String
    },
    montant: {
        required: false,
        type: String
    },
    solde: {
        required: false,
        type: String
    },
    
})

module.exports = mongoose.model('abonnement', dataSchema);
