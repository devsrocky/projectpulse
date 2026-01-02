const mongoose = require('mongoose');
const DataSchema = mongoose.Schema({

    title: {type: String, default: 'Risk/problem name', required: true},
    severity: {type: String, default: 'medium', required: true},
    mitigationPlan: {type: String, required: true},
    status: {type: String, required: true},
    projectId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "projects"},
    employeId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'}

}, {timestamps: true, versionKey: false});

const RiskModel = mongoose.model('risks', DataSchema);
module.exports = RiskModel;