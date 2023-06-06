const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    
    
    type: {
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
    
    
})

module.exports = mongoose.model('abonnement', dataSchema);
