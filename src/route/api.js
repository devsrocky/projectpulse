const express = require('express');
const router = express.Router();

// AUTH-MIDDLEWARE
const Auth = require('../middleware/AuthVerification');

// CONTROLLERS
const UserController = require('../controller/UserController');
const AdminController = require('../controller/AdminController');
const ClientController = require('../controller/ClientController');
const EmployeeController = require('../controller/EmployeeController');


// USER || routes
router.post('/CreateUser', Auth, UserController.CreateUser);
router.post('/UserLogin', UserController.UserLogin);
router.get('/Logout', UserController.Logout);

// Projects || routes for admin
router.post('/create-project-by-admin', Auth, AdminController.CreateProjectByAdmin)
router.post('/update-project-by-admin/:projectId', Auth, AdminController.UpdateProjectByAdmin)
router.get('/project-list-by-admin', Auth, AdminController.ProjectListByAdmin)
router.get('/project-details-by-admin/:projectId', Auth, AdminController.ProjectDetailsByAdmin)
router.get('/risk-list-by-admin/:severity/:status', Auth, AdminController.RiskListByAdmin)
router.get('/project-group-list-by-admin/:status', Auth, AdminController.CheckInListByAdmin)
router.get('/GetHighRisk', Auth, AdminController.GetHighRisk)
router.get('/GetAllMissingCheckIn/:projectId', Auth, AdminController.GetAllMissingCheckIn)

// Projects || routes for client
router.get('/client-project-list', Auth, ClientController.ProjectListByClient)
router.get('/client-project-details/:projectId', Auth, ClientController.ProjectDetailsByClient)
router.post('/create-feedback', Auth, ClientController.CreateFeedback)

// Risk || routes for client
router.post('/report-problem', Auth, EmployeeController.reportProblem)
router.post('/report-update', Auth, EmployeeController.reportUpdate)
router.post('/weekly-checkin', Auth, EmployeeController.weeklyCheckIn)
router.get('/employee-project-lists', Auth, EmployeeController.EmployeesProjectList)
router.get('/employee-project-details/:projectId', Auth, EmployeeController.EmployeeProjectDetails)


module.exports = router;