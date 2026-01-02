const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const ProjectModel = require('../model/ProjectModel');
const RiskModel = require('../model/RiskModel');
const CheckinModel = require('../model/CheckinModel');

const reportProblemService = async (req) => {
    try{

        let user = JSON.parse(req.headers['Userdetails']);
        let PostBody = req.body;
        PostBody['employeId'] = user['_id'];
        if( user['role'] !== 'Employee') return {status: 'denied', message: 'You aren\'t capable!'};

        let project = await ProjectModel.find(
            {_id: new ObjectId(PostBody['projectId']), employes: new ObjectId(user['_id'])}
        )
        if(!project.length) return {status: 'empty', message: 'Project didn\'t found!'}

        await RiskModel.create(PostBody)
        return {status: 'success', message: 'Reported'}


    }catch(err){
        return {status: 'failed', message: err.toString()}
    }
}

const reportUpdateService = async (req) => {
    try {
        let user = JSON.parse(req.headers['Userdetails']);
        let PostBody = req.body;
        PostBody['employeId'] = user['_id'];
        if( user['role'] !== 'Employee') return {status: 'denied', message: 'You aren\'t capable!'};

        let project = await ProjectModel.find(
            {_id: new ObjectId(PostBody['projectId']), employes: new ObjectId(user['_id'])}
        )
        if(!project.length) return {status: 'empty', message: 'Project didn\'t found!'}
        await RiskModel.updateOne({_id: new ObjectId(PostBody['reportId'])}, {$set: {status: 'resolved'}})
        return {status: 'success', message: 'Reported update success'}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const weeklyCheckInService = async (req) => {
    try {

        let user = JSON.parse(req.headers['Userdetails']);
        let PostBody = req.body;
        PostBody['employeId'] = user['_id'];
        if( user['role'] !== 'Employee') return {status: 'denied', message: 'You aren\'t capable!'};
        
        let project = await ProjectModel.aggregate([
            {$match: {_id: new ObjectId(PostBody['projectId'])}}
        ])
        if(!project.length) return {status: 'empty', message: 'Project didn\'t found!'}

        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        PostBody.weekStartDate = startOfWeek;

        let existingCheckIn = await CheckinModel.findOne({
            projectId: PostBody['projectId'],
            employeId: user['_id']
        });
        if(existingCheckIn) return {status: 'submited', message: 'Weekly check-in already submited'};

        let data = await CheckinModel.create(PostBody);
        return {status: 'success', message: 'Weekly check-in submited successfully', data: data};
        
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}


const EmployeesProjectListService = async (req) => {
    try{

        let user = JSON.parse(req.headers['Userdetails']);

        let projects = await ProjectModel.aggregate([
            {$match: {employes: new ObjectId(user['_id'])}},
            {$project: {'_id': 1, 'name': 1, 'status': 1, 'healthScore': 1}}
        ])
        if(!projects) return {status: 'empty', message: 'Project didn\'t assigned now!'}

        
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        let checkIn = await CheckinModel.findOne({
            projectId: new ObjectId(projects[0]['_id']),
            employeId: new ObjectId(user['_id']),
            weekStartDate: startOfWeek
        })

        let data = {
            name: projects[0]['name'],
            status: projects[0]['status'],
            healthScore: projects[0]['healthScore'],
            pendingCheckIn: checkIn ? false : true // false means submited
        } 

        return {status: 'success', data: data}
    }catch(err){
        return {status: 'failed', message: err.toString()};
    }
}

const EmployeeProjectDetailsService = async (req) => {
    try {

        let user = JSON.parse(req.headers['Userdetails']);
        let projectId = req.params.projectId;
        let matchStage = {$match: {_id: new ObjectId(projectId), employes: new ObjectId(user['_id'])}};

        let project = await ProjectModel.aggregate([
            matchStage
        ])
        if(!project.length) return {status: 'empty', message: 'Project didn\'t found!'};

        let checkIns = await CheckinModel.find({
            projectId: new ObjectId(projectId),
            employeId: new ObjectId(user['_id'])
        }).sort({createdAt: -1})

        let risks = await RiskModel.find({
            projectId: new ObjectId(projectId)
        }).select("title severity status mitigationPlan employeId createdAt");

        let data = {
            project: project,
            checkIns: checkIns,
            risks: risks
        }
        
        return {status: 'success', data: data}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

module.exports = {
    reportProblemService,
    reportUpdateService,
    weeklyCheckInService,
    EmployeesProjectListService,
    EmployeeProjectDetailsService
}
