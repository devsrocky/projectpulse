const { ProjectListByClientService, CreateFeedbackService, ProjectDetailsByClientService } = require("../service/ClientService")

exports.ProjectListByClient = async (req, res) => {
    let data = await ProjectListByClientService(req);
    return res.status(200).json(data)
}

exports.CreateFeedback = async (req, res) => {
    let data = await CreateFeedbackService(req);
    return res.status(200).json(data)
}

exports.ProjectDetailsByClient = async (req, res) => {
    let data = await ProjectDetailsByClientService(req);
    return res.status(200).json(data)
}