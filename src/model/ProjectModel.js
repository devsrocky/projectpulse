const mongoose = require('mongoose');
const DataSchema = mongoose.Schema({

    name: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, 
        enum: ['on_track', 'at_risk', 'critical', 'completed'],
        default: 'on_track'
    },
    healthScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
    },
    client: {type: mongoose.Schema.Types.ObjectId, required: true},
    employes: [{type: mongoose.Schema.Types.ObjectId, required: true}],
    adminId: {type: mongoose.Schema.Types.ObjectId, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},

}, {versionKey: false});

const ProjectModel = mongoose.model('projects', DataSchema);
module.exports = ProjectModel;