const mongoose = require('mongoose');
const DataSchema = mongoose.Schema({

    projectId: {type: mongoose.Schema.Types.ObjectId, required: true},
    employeId: {type: mongoose.Schema.Types.ObjectId, required: true},
    weekStartDate: {type: Date, required: true},
    summary: {type: String, trim: true},
    blockers: {type: String, trim: true},
    confidenceLebel: {type: Number, min: 1, max: 5, required: true},
    completePercentage: {type: Number, min: 0, max: 100, required: true}

}, {timestamps: true, versionKey: false});

const CheckinModel = mongoose.model('checkins', DataSchema);
module.exports = CheckinModel;