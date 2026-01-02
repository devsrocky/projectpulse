const mongoose = require('mongoose');
const DataSchema = mongoose.Schema({
    projectId: {type: mongoose.Schema.Types.ObjectId, required: true},
    clientId: {type: mongoose.Schema.Types.ObjectId, required: true},
    weekStartDate: {type: Date, required: true},
    rating: {type: Number, min: 1, max: 5, required: true},
    comments: {type: String, required: true},
    flagIssue: {type: Boolean}
}, {timestamps: true, versionKey: false})

const FeedbackModel = mongoose.model('feedbacks', DataSchema);
module.exports = FeedbackModel;