var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    taskId: Number,
    taskName: String,
    taskAssgn: {
        type: Number,
        ref: 'Developer'
    },
    taskDate: {
      type:  Date,
      default: Date.now
    
    },
    taskStatus: {
        type: String,
        validate: {
            validator: function(statusValue){
                return statusValue === 'In Progress' || statusValue === 'Complete'
            },
            message: 'Status should be either In Progress or Complete'
        }
    },
    taskDesc: String
});

module.exports = mongoose.model('Task', taskSchema);