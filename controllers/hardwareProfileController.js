const HardwareProfileFive = require('../models/hardwareProfileFiveModel')
const HardwareProfileSix = require('../models/hardwareProfileSixModel')
const md5 = require('md5')
const dbConn = require('../dbConnection')

// get all hardware Profile list
exports.getHardwareProfileListFive = (req, res) => {
    HardwareProfileFive.getAllHardwareProfileFive(req.params , (err, hardwareprofiles) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            success: true,
            hardwareprofiles
        })
    })
}



// get all hardware Profile list
exports.getHardwareProfileListSix = (req, res) => {

    HardwareProfileSix.getHardwareProfileListSix(req.params , (err, hardwareprofiles) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            success: true,
            hardwareprofiles
        })
    })
   
}



// update Hardware Profile
exports.registerHardwareProfileFive = (req, res)=>{
    const data = new HardwareProfileFive(req.body);
    // console.log('data update', data);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({
            success: false, 
            message: 'Please fill all fields'
        });
    }else{
        dbConn.query('SELECT * FROM owner_serial WHERE serial_key = ?', [req.body.serial_key] , (err, checkResult) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'DB error',
                })
            } else {
               if(checkResult.length == 0){
        HardwareProfileFive.registerHardwareProfileFive(data, (err, hardwareprofile)=>{
            if(err){
                res.status(500).json({
                    status: true,
                    message: 'Hardware Profile Creation Failed',
                })
            }
            else{
                res.status(201).json({
                    status: true,
                    message: 'Hardware Profile Created Successfully',
                })
            }
           
            
        })
    }
    else{
        res.status(200).json({
            success: false,
            message: 'A device with same serial is already registered',
        })
    }
}
        })
    }
}


// update Hardware Profile
exports.updateHardwareProfileFive = (req, res)=>{
    const data = req.body
    // console.log('data update', data);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({
            success: false, 
            message: 'Please fill all fields'
        });
    }else{
        HardwareProfileFive.updateHardwareProfileFive(req.params.id, data, (err, hardwareprofile)=>{
            if(err)
            res.send(err);
            res.json({
                status: true,
                message: 'Hardware Profile updated Successfully',
            })
        })
    }
}



exports.deleteHardwareProfileFive = (req, res)=>{
    HardwareProfileFive.deleteHardwareProfileFive(req.params.id, (err, group)=>{
        if(err)
        res.send(err);
        res.json({success:true,
             message: 'Hardware Profile deleted successully!'
        });
    })
}

