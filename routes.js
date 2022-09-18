const express = require('express');
const router = require('express').Router();
const dbConn = require('./dbConnection')
const md5 = require('md5');
const { body } = require('express-validator');
const { login,forgotpassword,updatepass } = require('./controllers/loginController');
const multer  = require('multer');

const auth = require("./middleware/auth")
const app = express(); 

app.use('profile', express.static('profile'))

const profileStorage = multer.diskStorage({
    destination: 'profile',
    filename:(req,file, cb) =>{
        return cb(null, `${file.fieldname}_${Date.now()}${paths.extname(file.originalname)}`)
    }
})

const profileupload = multer({
    storage: profileStorage,
    limits: {fileSize: 2000000},
})
const {getpdf,getNotepdf,livesessionImage,livesessionImagedownload,livesessionNotes,liveSessionData,reoprtSessionNotes,getScreenshot,getPrevScreenshot,savescreenshort} = require('./controllers/savepdfControlller');
const { getTrainerList, getTrainerInactiveList, getTrainerByID, createNewTrainer, updateTrainer,activateTrainer,deactivateTrainer, deleteTrainer } = require('./controllers/trainerController');
const { getClientList, getInctiveClientList,  getClientByID, createNewClient, updateClient, deleteClient , deactivateClient, activateClient } = require('./controllers/clientController');
const { getGroupProfileByGroupID, getGroupByID, createNewGroup, updateGroup,updateGroupProfile, deleteGroup } = require('./controllers/groupController');
const { getSessionList,getSessionbyClient, getRecordList, getSessionAllData, getSessionSignalData ,getSessionInfo,getClientInfo,getAllDataByType,updateZoomLink,getzoomLinkbyid } = require('./controllers/sessionController');
const { getConfigList,getMultiReportSignalList,getReportConfig,viewReportConfig,viewMultiReportConfig,viewReportDetails,viewMultiReportDetails,getSavedReportConfig,getSingleReportPdf,getSingleReport,getMultileReport,getMultileReportPdf,getAllNotes, saveAlternateSingleReport,getAlternateSingleReport,saveAlternateSingleGraph , saveSingleReport , saveMultiReport , createMultiReport ,  saveSingleGraph , saveMultiGraph , saveGroupGraph,updateSingleReport,updateSingleGraph,updateGroupGraph } = require('./controllers/reportController');

const { getOwnerProfile,getEmailbyDomain,getEmailForSubscription,getEmailListForSubscription,getExpiredAccount,getGroupPrice,saveEmailForSubscription,renewOwnerProfile, updateOwner,updateSubscriptionsDetails } = require('./controllers/editAdminProfileController');
const { getRecordingList } = require('./controllers/getRecordingController');
const { getHardwareProfileListFive, getHardwareProfileListSix , updateHardwareProfileFive ,registerHardwareProfileFive,deleteHardwareProfileFive} = require('./controllers/hardwareProfileController');

const { getUser } = require('./controllers/getUserController');
// const { getAllForms } = require('./models/blankFormModel');
const { getTrainerListForm,getAllForm,getAllBlankForm, getClientListForm, uploadClientForm, deleteClientForm,deleteTrainerForm, uploadClientHomework,uploadTrainerForm,getClientHomework,deleteClientHomework,getblankPdfbyid } = require('./controllers/formController');
const {subscribedAccounts,allAccounts,subscriberUserList,getExpireDate7days,getExpireDate30days,updateExpirydate,updateExpirydatebyYEAR} = require('./controllers/subscribeuserControlller')
const {getFullscreenshort2,saveAssemblyFullscreenshort,getAssemblylistbyid,assemblylist,updateAssemblyreport,getCompleteformsClient,getCompleteformsTrainer,getNmaes,getassemblyliveNotes,getassemblyliveimages,assemblypdfreports,getclientformName,getpractionerformname,saveAssemblyreport,getassemblySetionReport,getassemblyReportsesseionNotes,displayEssemblylist,DeletedisplayEssemblylist} = require('./controllers/assemblyController')
const {updateonlineAccess,updateonlineAccessBydomain,updateonlineAccessByemail,getDomains,getonlineAccessList,getEmail} = require('./controllers/onlineAccessController')

// onlineaccess api
router.get('/get/onlineaccess/list',getonlineAccessList); // online Access list
router.get('/get/email/list/:email/:type',getEmail); // get email list
router.get('/get/domain/list/:domains/:type',getDomains); // get getDomains list
router.post('/update/online/access/byemail/:email',updateonlineAccessByemail); // updateonlineAccessByemail
router.post('/update/online/access/bydomain/:domain',updateonlineAccessBydomain); // updateonlineAccessBydomain
router.post('/update/online/access/:id',updateonlineAccess); // updateonlineAccess

// subscriber user list api
router.get('/subscriber/user/list',subscriberUserList); // subscriber user list
router.get('/subscriber/all/accounts/list',allAccounts); // subscriber allAccounts user list
router.get('/subscribed/accounts/list',subscribedAccounts); // subscribed Accounts user list
router.get('/exprie/next/sevendays',getExpireDate7days); // 7 days expridate api user list
router.get('/exprie/next/thirtydays',getExpireDate30days); // 30 days expridate api user list
router.get('/pdf/list/:id',getpdf);
router.get('/get/pdfnotes/list/:id',getNotepdf);
// router.get('/get/pdfnotes/list/:id',getNotepdf);
router.get('/get/live/sessionimage/:sessionid/:data_type',livesessionImage);
router.get('/get/live/sessionimage/download/:sessionid/:data_type',livesessionImagedownload);
router.get('/get/live/session/notes/:sessionid/:data_type',livesessionNotes);

router.get('/get/live/session/info/:sessionid/:data_type',liveSessionData);
router.get('/view/report/notes/:sessionid',reoprtSessionNotes);

router.post('/save/screenshot',profileupload.single('data'),savescreenshort);
router.get('/get/screenshot/:id',getScreenshot);
router.post('/update/expiry/date/:id',updateExpirydate);
router.post('/update/expiry/date/byyear/:id',updateExpirydatebyYEAR);


router.get('/get/previous/screenshot/:id/:cid',getPrevScreenshot);
router.get('/assembly/session/report/:session_id',assemblypdfreports);

router.post('/save/assembly/report',saveAssemblyreport);
router.get('/get/assembly/report/:id',getassemblySetionReport);
router.get('/get/assembly/Sessionnotes/:id',getassemblyReportsesseionNotes);
router.get('/get/assembly/liveimages/:id',getassemblyliveimages);
router.get('/get/livenotes/:id',getassemblyliveNotes);
router.get('/assembly/list',assemblylist);
router.get('/assembly/list/by/:id',getAssemblylistbyid);
router.post('/update/assembly/report/:id',updateAssemblyreport);
router.post('/save/assembly/fullscreenshort/:id',saveAssemblyFullscreenshort);
router.get('/get/full/screenshort/:id/:cl_id',getFullscreenshort2);
router.get('/display/assembly/list/:id',displayEssemblylist);
router.delete('/delete/assembly/list/:id',DeletedisplayEssemblylist);



          
router.get('/get/client/formname/:cl_id',getclientformName);
router.get('/get/practioner/formname/:clientid/:sessionid',getpractionerformname);
 
router.get('/get/names/:id',getNmaes); 
router.get('/get/assembly/complete/form/:id/:cl_id',getCompleteformsClient);
router.get('/get/assembly/complete/tform/:id/:cl_id',getCompleteformsTrainer);
// Login
router.post('/login',[
    body('email',"Invalid email address")
    .notEmpty()
    .escape()
    .trim().isEmail(),
    body('password',"The Password must be of minimum 4 characters length")
    .notEmpty()
    .trim()
    .isLength({ min: 4 }),
], login);

// Get User 
router.get('/getuser',getUser); // get owner list

// Trainer
router.get('/trainers',auth, getTrainerList) // get trainer list
router.get('/trainer/profile/:id',auth, getTrainerByID) // get trainer by id
router.post('/trainer/create',auth, createNewTrainer) // insert new trainer
router.post('/trainer/update/:id',auth, updateTrainer) // edit trainer by id
router.post('/trainer/activate/:id',auth, activateTrainer) // edit trainer by id
router.post('/trainer/deactivate/:id',auth, deactivateTrainer) // edit trainer by id
router.post('/trainer/delete/:id',auth, deleteTrainer) // delete trainer by id

// Client
router.get('/clients',auth, getClientList) // get client list 
router.get('/client/profile/:id',auth, getClientByID) // get client by id
router.post('/client/create',auth, createNewClient) // insert new client
router.post('/client/update/:id',auth, updateClient) // edit client by id
router.post('/client/delete/:id',auth, deleteClient) // delete client by id
router.post('/client/deactivate/:id',auth, deactivateClient) // edit trainer by id
router.post('/client/activate/:id',auth, activateClient) // edit trainer by id



//Sessions
router.get('/sessions',auth, getSessionList) // get session list
router.get('/sessions/by/client', getSessionbyClient) // get session by client list 
router.get('/session/record',auth, getRecordList) // get record list 
router.get('/session/data/all',auth, getSessionAllData) // get session data list 
router.get('/session/data',auth, getSessionSignalData) // get session data list 
router.get('/session/info',auth, getSessionInfo) // get session data list 
router.get('/client/info',auth, getClientInfo) // get session data list 
router.get('/session/data/type',auth, getAllDataByType) // get session data list 
router.post('/session/zoom/link/:id',auth, updateZoomLink) // get session data list 
router.get('/get/zoom/link/by/:id', getzoomLinkbyid) // get session data list 

//Forms
router.get('/forms/blank', getAllBlankForm) // get session data list 
router.get('/forms/blank/:type', getAllForm) // get session data list 
router.get('/get/blank/pdf/by/:id', getblankPdfbyid) // get session data list 
// router.get('/forms/client',auth, getClientForm) // get session data list
router.get('/forms/client/:cl_id', getClientListForm) // get session data list 
router.get('/forms/trainer/:clientid', getTrainerListForm) // get session data list 
// router.get('/forms/trainer', getTrainerForm) // get session data list 
router.post('/forms/client/upload',auth, uploadClientForm) // get session data list 
router.post('/forms/client/delete/:id',auth, deleteClientForm) // get session data list 
router.post('/forms/trainer/delete/:id',auth, deleteTrainerForm) // get session data list 

router.post('/homework/client/delete/:id', deleteClientHomework) // get session data list 
router.post('/homework/client/upload',auth, uploadClientHomework) // get session data list 
router.get('/homework/client/:cl_id', getClientHomework) // get session data list 
router.post('/forms/trainer/upload',auth, uploadTrainerForm) // upload trainer forms

 
//Reports
router.get('/configured/report',auth, getConfigList) // get pre-config reports list 
router.get('/configured/signals',auth, getMultiReportSignalList) // get multi report signals list 
router.get('/report/config',auth, getReportConfig) // get pre-config report config
router.get('/view/report/config',auth, viewReportConfig) // get pre-config report config
router.get('/view/report/multi/config',auth, viewMultiReportConfig) // get pre-config report config
router.get('/view/report/details',auth, viewReportDetails) // get pre-config report config
router.get('/view/multi/report/details',auth, viewMultiReportDetails) // get pre-config report config

router.get('/report/saved/config',auth, getSavedReportConfig) // get saved report config
router.get('/report/single',auth, getSingleReport) // get single-session report
router.get('/report/single/pdf',auth, getSingleReportPdf) // get single-session report pdf
router.get('/report/multiple',auth, getMultileReport) // get multi-session report
router.get('/report/multiple/pdf',auth, getMultileReportPdf) // get multi-session report pdf
// router.get('/report/multiple',auth, getMultileReport) // get pre-config report config
// router.get('/report/multiple/pdf',auth, getMultileReportPdf) // get pre-config report config
router.get('/report/notes', getAllNotes) // get  report notes
 
router.post('/create/multi/session', createMultiReport) // get  report notes
// router.post('/save/single/report/graph', saveSingleGraph) // get  report notes



router.get('/get/single/alertnate/report/config/:original/:user/:type', auth, getAlternateSingleReport) // get  report notes
router.post('/save/single/alertnate/report/config', saveAlternateSingleReport) // get  report notes
router.post('/save/single/alertnate/report/graph', saveAlternateSingleGraph) // get  report notes


// router.get('/get/single/alertnate/report/config/:original/:user/:type', auth, getAlternateSingleReport) // get  report notes

router.post('/save/single/report', saveSingleReport) // get  report notes
router.post('/save/single/report/graph', saveSingleGraph) // get  report notes

router.post('/save/multi/report', saveMultiReport) // get  report notes
router.post('/save/multi/report/graph', saveMultiGraph) // get  report notes


 

router.post('/update/single/report', updateSingleReport) // get  report notes
router.post('/update/single/report/graph', updateSingleGraph) // get  report notes
 
router.post('/save/group/report/graph', saveGroupGraph) // get  report notes

// router.post('/update/single/report', updateSingleReport) // get  report notes
router.post('/update/group/report/graph', updateGroupGraph) // get  report notes


// Group 

router.get('/group/:id',auth, getGroupByID) // get group by ID
router.post('/group/create',auth, createNewGroup) // create new group
router.post('/group/update/:id',auth, updateGroup) // Update Group by ID
router.post('/group/delete/:id',auth, deleteGroup) // Delete Group 
     
router.get('/group/profile/:id',auth, getGroupProfileByGroupID) // Get Devices in Group
router.post('/group/profile/update/:id',auth, updateGroupProfile) // Update Devices in Group by ID


// Edit Admin Profile
router.post('/owner/update/:id',auth, updateOwner) // Update Owner Profile
router.get('/owner/profile/:id',auth, getOwnerProfile) //Get Owner Profile
router.post('/owner/subscription/update/:id', updateSubscriptionsDetails) //Update owner Subscription 

// Recodring Distributor List
router.get('/recording/distributor',auth , getRecordingList) // Get Recordings by Distributor

// Hardware Profile 5.0
router.get('/device/five/profile/:owner', getHardwareProfileListFive) // Get List of 5.0 of user
router.post('/device/five/update/:id',auth, updateHardwareProfileFive) // Update 5.0 of user
router.post('/device/five/register',auth, registerHardwareProfileFive) // Register 5.0 of user
router.post('/device/five/delete/:id',auth, deleteHardwareProfileFive) // Delete 5.0 of user

// Hardware Profile 6.0

router.get('/device/six/profile/:owner', getHardwareProfileListSix) // Get 6.0 Devices of users
// router.get('/subscription/details/:user', getUserProfile) // Get 6.0 Devices of users
router.get('/user/profile/:id', getOwnerProfile) //Get Owner Profile
router.post('/complete/renewal/:id', renewOwnerProfile) //Get Owner Profile

router.get('/emails/:domain',auth, getEmailbyDomain) //Get Email by domain
router.post('/add/emails',auth, saveEmailForSubscription) //Get Email by domain
router.get('/get/group/emails',auth, getEmailForSubscription) //Get Email by domain
router.get('/get/group/list/:domain',auth, getEmailListForSubscription) //Get Email by domain
 
router.get('/get/expired/accounts', getExpiredAccount) //Get Email by domain
router.get('/get/group/price/:id', getGroupPrice) //Get Email by domain
// router.get('/get/group/price/:id', getGroupPrice) //Get Email by domain


// forgot password api
router.post("/api/forgot/password", forgotpassword)
router.post("/api/update/password", updatepass)



// get country list
router.get('/countries',auth, function(req, res) {
    dbConn.query('SELECT * FROM countries', function(err, rows) {
 
        if (err) {
            res.json({
                msg: 'error'
            });
        } else {
            res.json({
                msg: 'success',
                countries: rows
            });
        }
    });
});

// get state list according to country_id
router.get('/states',auth, function(req, res) {
    dbConn.query('SELECT * FROM states WHERE country_id = "' + req.query.country_id + '"',
        function(err, rows, fields) {
            if (err) {
                res.json({
                    msg: 'error'
                });
            } else {
                res.json({
                    msg: 'success',
                    states: rows
                });
            }
        });
});

// // get client group list
// router.get('/getclientgroup/:id/:user_type/:status', function(req, res) {
//     var trainerCondition ; 
//     var query ;
//     if(req.params.alltrainer){
//         trainerCondition = ' AND associated_owner = "' + md5(req.params.id) + '" ' ; 
//     }
//     else{
//         trainerCondition = ' AND associated_practioner = "' + md5(req.params.id) + '" ' ; 
//     }
//     if(req.params.status == 2){
//         query = 'SELECT * FROM capno_users WHERE user_type = "' + req.params.user_type + '" ' + trainerCondition ;
//     }
//     else{
//         query = 'SELECT * FROM capno_users WHERE user_type = "' + req.params.user_type + '"  AND status = "' + req.params.status + '"  ' + trainerCondition ;
//     }
    
//     // if(query) {
//     dbConn.query(query, function(err, rows, fields) {
//         if (err) {
//             res.json({
//                 msg: 'error'
//             })
//         } else {
//             res.json({
//                 msg: 'success',
//                 states: rows
//             })
//         }
//     })
    
// })

module.exports = router; 
