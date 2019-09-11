var mongoose = require('mongoose');

var devSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    devId: Number,
    name: {
        firstName: String,
        lastName: String
    },
    level: {
        type: String,
        validate: {
            validator: function(levelValue){
                return levelValue === 'Beginner' || levelValue === 'Expert'
            },
            message: 'Level should be either Beginner or Expert'
        }
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: String
    },

});

module.exports = mongoose.model('Developer', devSchema);
