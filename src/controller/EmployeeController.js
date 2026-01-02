const { reportProblemService, reportUpdateService, weeklyCheckInService, EmployeesProjectListService, EmployeeProjectDetailsService } = require("../service/EmployeeService");

exports.reportProblem = async (req, res) => {
    let data = await reportProblemService(req);
    return res.status(200).json(data)
}

exports.reportUpdate = async (req, res) => {
    let data = await reportUpdateService(req);
    return res.status(200).json(data)
}

exports.weeklyCheckIn = async (req, res) => {
    let data = await weeklyCheckInService(req);
    return res.status(200).json(data)
}

exports.EmployeesProjectList = async (req, res) => {
    let data = await EmployeesProjectListService(req);
    return res.status(200).json(data)
}

exports.EmployeeProjectDetails = async (req, res) => {
    let data = await EmployeeProjectDetailsService(req);
    return res.status(200).json(data)
}