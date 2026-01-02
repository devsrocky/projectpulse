const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const ProjectModel = require('../model/ProjectModel');
const FeedbackModel = require('../model/FeedbackModel');
const RiskModel = require('../model/RiskModel');

const ProjectListByClientService = async (req) => {
    try {

        let user = JSON.parse(req.headers['Userdetails'])
        let matchStage = {$match: {client: new ObjectId(user['_id'])}}
        let projection = {$project: {
            '_id': 1,
            'name': 1,
            'status': 1,
            'healthScore': 1
        }}


        let project = await ProjectModel.aggregate([
            matchStage, projection
        ])

        let lastFeedback = await FeedbackModel.findOne({
            projectId: new ObjectId(project[0]['_id']),
            clientId: new ObjectId(user['_id'])
        }).sort({createdAt: -1})


        let data = {
            _id: project[0]['_id'],
            name: project[0]['name'],
            status: project[0]['status'],
            healthScore: project[0]['healthScore'],
            lastFeedback: lastFeedback ? lastFeedback['createdAt'] : null
        }

        return {status: 'success', data: data}
        
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}


const CreateFeedbackService = async (req) => {
    try {
        
        let user = JSON.parse(req.headers['Userdetails']);
        let PostBody = req.body;
        PostBody['clientId'] = user['_id'];

        let matchStage = {$match: {client: new ObjectId(user['_id'])}}
        if(user['role'] === 'Client'){

            // Is project assigned to client
            let IsProject = await ProjectModel.aggregate([matchStage]);
            if(!IsProject || IsProject.length === 0){
                return {status: 'empty', message: 'Project assigned empty!'}
            };


            // It will check feedback already submited to this week?
            const startOfWeek = new Date();
            startOfWeek.setHours(0, 0, 0, 0);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            let exstingFeedback = await FeedbackModel.findOne({
                projectId: new ObjectId(IsProject[0]['_id']),
                clientId: new ObjectId(user['_id']),
                weekStartDate: {$gte: startOfWeek, $lte: endOfWeek}
                
            })
            if(exstingFeedback){
                return {status: 'exist', message: 'Feedback already submited to this week!'}
            }
            
            // Create feedback
            await FeedbackModel.create(PostBody);
            return {status: 'success', message: 'Feedback submited successfully!'}
        }else{
            return {status: 'success', data: 'You aren\'t capable'}
        }
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}


const ProjectDetailsByClientService = async (req) => {
    try {
        
        let uesr = JSON.parse(req.headers['Userdetails']);
        let projectId = req.params.projectId;
        let matchStage = {$match: {_id: new ObjectId(projectId), client: new ObjectId(uesr['_id'])}};
        let projection = {$project: { 'name': 1, 'description': 1, 'status': 1, 'healthScore': 1}}

        let project = await ProjectModel.aggregate([  matchStage, projection ]);
        if(!project){ return {status: 'empty', message: 'Project not found'} };

        let feedbackList = await FeedbackModel.aggregate([
            {$match: {projectId: new ObjectId(projectId), clientId: new ObjectId(uesr['_id'])}},
            {$sort: {createdAt: -1 }}
        ])

        let lastFeedback = feedbackList.length ? feedbackList[0].createdAt : null; // Get feedback last date
        let risk = await RiskModel.aggregate([ 
            {$match: {projectId: new ObjectId(projectId)}},
            {$project: {'title': 1, 'severity': 1, 'status': 1, 'createdAt': 1}}
        ]);

        let data = {
            _id: project[0]['_id'],
            name: project[0]['name'],
            status: project[0]['status'],
            healthScore: project[0]['healthScore'],
            lastFeedback: lastFeedback,
            feedbackHistory: feedbackList,
            risk: risk
        }

        return {status: 'success', data: data}

    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

module.exports = {
    ProjectListByClientService,
    CreateFeedbackService,
    ProjectDetailsByClientService
}