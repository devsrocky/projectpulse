const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const UserModel = require('../model/UserModel');
const ProjectModel = require('../model/ProjectModel');
const RiskModel = require('../model/RiskModel');


const CreateProjectService = async (req) => {
     try{
        let user = JSON.parse(req.headers['Userdetails']);
        let PostBody = req.body;
        PostBody.adminId = user['_id'];
        if(user['role'] === 'Admin'){
            let data =  await ProjectModel.create(PostBody)
            return {status: 'success', message: 'Project created success', data: data}
        }else{
            return {status: 'success', message: user}
        }
     }catch(err){
        return {status: 'success', message: err.toString()}
     }
}

const UpdateProjectService = async (req) => {
    try {
        let projectId = req.params.projectId;
        let PostBody = req.body;
        let user = JSON.parse(req.headers['Userdetails']);
        let data = await ProjectModel.updateOne({_id: new ObjectId(projectId), adminId: new ObjectId(user['_id'])}, {$set: PostBody})
        return {status: 'success', message: 'Project update successed', data: data}

    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const ProjectListByAdminService = async (req) => {
    try {
        let user = JSON.parse(req.headers['Userdetails']);
        if(user['role'] === 'Admin'){

            let clientJoin = {$lookup: {from: 'users', localField: 'client', foreignField: '_id', as: 'client'}};
            let projection = {$project: {
                '_id': 1,
                'name': 1,
                'status': 1,
                'healthScore': 1,
                'clientName': {$arrayElemAt: ['$client.name', 0]}
            }}
            let data = await ProjectModel.aggregate([
                clientJoin, projection
            ])
            return {status: 'success', data: data}

        }else{
            return {status: 'failed', message: 'You aren\'t capable to view list'}
        }
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const ProjectDetailsByAdminService = async (req) => {
    try {

        let user = JSON.parse(req.headers['Userdetails']);
        let projectId = req.params.projectId;
        let matchStage = {$match: {_id: new ObjectId(projectId)}};

        let joinClient = {$lookup: {from: 'users', localField: 'client', foreignField: '_id', as: 'client'}};
        let joinEmploye = {$lookup: {from: 'users', localField: 'employes', foreignField: '_id', as: 'employees'}};
        let unwindClient = {$unwind: '$client'};

        let Projection = {$project: {
           '_id': 1,
           'name': 1,
           'description': 1,
           'status': 1,
           'healthScore': 1,
           'clientName': '$client.name',
           'adminId': 1,
           'startDate': 1,
           'endDate': 1,
           'employees._id': 1,
           'employees.name': 1
        }}

        let data = await ProjectModel.aggregate([
            matchStage, joinClient, joinEmploye, unwindClient, Projection
        ])

        return {status: 'success', data: data}
        
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const RiskListByAdminService = async (req) => {
    try {
        
        let severityFlt = req.params.severity;
        let statusFlt = req.params.status;

        const filter = {};
        if (severityFlt) filter.severity = severityFlt;
        if (statusFlt) filter.status = statusFlt;
        let risk = await RiskModel.find(filter).populate("projectId", "name status healthScore").populate("employeId", "name email role");
        let data = { riskCount: risk.length, risk: risk}
        return {status: 'success', message: data}

    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const GropuProjectInListByAdminService = async (req) => {
    try {
        
        let healthStatus = req.params.status;

        let data = await ProjectModel.aggregate([
            {$match: {status: healthStatus}},
            {$project: {'name':1, 'status':1, 'healthScore': 1}}
        ])

        return {status: 'success', data: data}

    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const GetHighRiskService = async (req) => {
    try {

    const { projectId, employeeId } = req.params;


    const filter = { severity: "high", status: "open" };
    if (projectId) filter.projectId = projectId;
    if (employeeId) filter.employeeId = employeeId;

    const risks = await RiskModel.find(filter).populate("projectId", "name status healthScore");

    const summary = {};
    risks.forEach((r) => {
      const proj = r.projectId;
      if (!summary[proj._id]) {
        summary[proj._id] = {
          projectId: proj._id,
          name: proj.name,
          highRiskCount: 0,
        };
      }
      summary[proj._id].highRiskCount += 1;
    });


    let data = {
        total: Object.keys(summary).length,
        highRiskProjects: Object.values(summary)
    }
    return {status: 'success', data: data}

  } catch (err) {
    return {status: 'failed', message: err.toString()}
  }
}


const GetAllMissingCheckInService = async (req, res) => {
  try {
    const user = JSON.parse(req.headers['Userdetails']);
    const { projectId } = req.params;

    const projects = await ProjectModel.find({ _id: new ObjectId(projectId) }).populate("employes", "_id name");

    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const missingCheckIns = [];

    for (const project of projects) {
      let pending = false;

      const employeesToCheck = user._id ? project.employes.filter(e => e._id.toString() === user._id) : project.employes;

      for (const emp of employeesToCheck) {
        const checkIn = await UserModel.findOne({
          projectId: project._id,
          employeeId: emp._id,
          weekStartDate: startOfWeek,
        });

        if (!checkIn) {
          pending = true;
          break;
        }
      }

      if (pending) {
        missingCheckIns.push({
          projectId: project._id,
          projectName: project.name,
          employees: employeesToCheck,
        });
      }
    }

    return {
      status: "success",
      data: {
        total: missingCheckIns.length,
        checkIns: missingCheckIns,
      },
    };
  } catch (err) {
    return { status: "failed", message: err.toString() };
  }
};




module.exports = {
    CreateProjectService,
    UpdateProjectService,
    ProjectListByAdminService,
    ProjectDetailsByAdminService,
    RiskListByAdminService,
    GropuProjectInListByAdminService,
    GetHighRiskService,
    GetAllMissingCheckInService
}