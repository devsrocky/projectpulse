const { CreateProjectService, UpdateProjectService, ProjectListByAdminService, ProjectDetailsByAdminService, RiskListByAdminService, CheckInListByAdminService, GropuProjectInListByAdminService, GetHighRiskService, GetAllMissingCheckInService } = require("../service/AdminServices");


exports.CreateProjectByAdmin = async (req, res) => {
    let data = await CreateProjectService(req);
    return res.status(200).json(data)
}

exports.UpdateProjectByAdmin = async (req, res) => {
    let data = await UpdateProjectService(req);
    return res.status(200).json(data)
}

exports.ProjectListByAdmin = async (req, res) => {
    let data = await ProjectListByAdminService(req);
    return res.status(200).json(data)
}

exports.ProjectDetailsByAdmin = async (req, res) => {
    let data = await ProjectDetailsByAdminService(req);
    return res.status(200).json(data)
}

exports.RiskListByAdmin = async (req, res) => {
    let data = await RiskListByAdminService(req);
    return res.status(200).json(data)
}

exports.CheckInListByAdmin = async (req, res) => {
    let data = await GropuProjectInListByAdminService(req);
    return res.status(200).json(data)
}

exports.GetHighRisk = async (req, res) => {
    let data = await GetHighRiskService(req);
    return res.status(200).json(data)
}

exports.GetAllMissingCheckIn = async (req, res) => {
    let data = await GetAllMissingCheckInService(req);
    return res.status(200).json(data)
}