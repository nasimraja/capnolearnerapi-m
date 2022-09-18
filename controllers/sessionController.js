const Session = require('../models/sessionModel')
const SessionRecord = require('../models/sessionRecordModel')
const SessionData = require('../models/sessionDataModel')
const dbConn = require('../dbConnection')
const md5 = require('md5')


// get all Session list
exports.getSessionList = (req, res) => {
 
        Session.getAllSession(req.query,(err, sessions) => {
            if(err)
            throw new Error(err)
            return res.status(200).json({ 
                status: true,
                sessions
            })
        })
    
   
}
exports.getSessionbyClient = (req, res) => {
 
    Session.getSessionbyClientId(req.query,(err, sessions) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            status: true,
            sessions
        })
    })


}

// get session data by client id



// get all Session Data
exports.getSessionAllData = (req, res) => {
 
    SessionData.getAllData(req.query,(err, sessions) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            status: true,
            sessions
        })
    })


}

// get all Session Dat by Type
exports.getAllDataByType = (req, res) => {
 
    SessionData.getAllDataByType(req.query,(err, sessions) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            status: true,
            sessions
        })
    })


}
 
// get all Session Images
exports.getSessionAllImages = (req, res) => {
 
    SessionData.getAllImages(req.query,(err, sessions) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            status: true,
            sessions
        })
    })


}



// get   Session Info
exports.getClientInfo = (req, res) => {
 
    Session.getClientInfo(req.query,(err, session) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            status: true,
            session
        })
    })


}


// get   Session Info
exports.getSessionInfo = (req, res) => {
 
    Session.getSessionInfo(req.query,(err, session) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            status: true,
            session
        })
    })


}

// get signal wise Session Data
exports.getSessionSignalData = (req, res) => {
 
    SessionData.getSignalData(req.query,(err, sessions) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            status: true,
            sessions
        })
    })


}


exports.getRecordList = (req, res) => {
 
    SessionRecord.getAllRecord(req.query,(err, records) => {
            if(err)
            throw new Error(err)
            return res.status(200).json({ 
                status: true,
                records
            })
        })
    
   
}
 

exports.updateZoomLink = (req, res) => {
 
    Session.updateZoomLink(req.params.id,req.body,(err, records) => {
            if(err){
                return res.status(200).json({ 
                    status: true,
                    message: "Zoom Link Update Failed"

                })
            }
           else{
            return res.status(200).json({ 
                status: true,
                message: "Zoom Link Updated Successfully"
            })
           }
            
        })
    
   
}



exports.getzoomLinkbyid = (req, resp) => {
    console.log(req.params.id)
    dbConn.query('SELECT * FROM client_session WHERE id = ? AND zoom_link != "null"',[req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
        else {
            resp.status(200).json({
                success: true,
                data: result
            })
        }
    })
}

