const Trainer = require('../models/trainerModel')
const Client = require('../models/clientModel')
const dbConn = require('../dbConnection')
const sendEmail = require('./emailController')
const md5 = require('md5');
 

// get all Trainer list
exports.getTrainerList = (req, res) => {
    Trainer.getAllTrainer(req.query,(err,trainers) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            status: true,
            trainers
        })
    })
}
 

// get Trainer by id
exports.getTrainerByID = (req,res) => {
    Trainer.getAllTrainerByID(req.params.id, (err, trainer) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            success: true,
            trainer
        })
    })
}

// create new Trainer
exports.createNewTrainer = (req, res) => {
    // console.log(req.body)
    const data = new Trainer(req.body)

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        })
    } else {
        dbConn.query('SELECT * FROM capno_users WHERE email = ?', [req.body.email] , (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'DB error',
                })
            } else {
               if(result.length > 0){
                res.status(400).json({
                    success: false,
                    message: 'Account already exist with this email',
                })
               }
               else{
        Trainer.createNewTrainer(data, (err, trainer) => {
            if(err) {
                res.send(err)
                res.json({
                    success: false,
                    message: "Somothing went wrong",
                })
            } else {
                let email = true ; 
                if(req.body.sendemail){
                    email  = sendEmail(req.body.firstname,req.body.email,2) ;
                        
                }
                data.lastname =  data.lastname+"(Self)" ;
                data.email =  data.email+"(Self)" ;
                data.user_type = 3 ;
                data.associated_practioner = md5(trainer.insertId.toString()) ;
                Client.createNewClient(data, (err, trainer) => {
                    if(err){
                        res.status(201).json({
                            success: true,
                            message: 'Trainer Inserted Successfully',
                            client : false,
                            email: email,
                            trainer
                        })
                    }
                    else{
                        res.status(201).json({
                            success: true,
                            message: 'Trainer Inserted Successfully',
                            client : false,
                            email: email,
                            trainer
                        })
                    }
               
            })
            }
        })
    }
}
        })
    }
}

// activate Trainer
exports.activateTrainer = (req, res)=>{
   
   
   
        Trainer.activateTrainer(req.params.id, (err, trainer)=>{
            if(err){
                res.status(500).json({
                    success: false,
                    message: 'DB error',
                    error: err
                })
            }
            else{
                res.status(200).json({
                    status: true,
                    message: 'Trainer updated Successfully',
                })
            }
           
           
        })
    }

    
// deactivate Trainer
exports.deactivateTrainer = (req, res)=>{
   
   
   
    Trainer.deactivateTrainer(req.params.id, (err, trainer)=>{
        if(err){
            res.status(500).json({
                success: false,
                message: 'DB error',
                error: err
            })
        }
        else{
            res.status(200).json({
                status: true,
                message: 'Trainer updated Successfully',
            })
        }
       
       
    })
}

 
// update Trainer
exports.updateTrainer = (req, res)=>{
    const data = new Trainer(req.body);
    console.log('data update', req.params.id);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({
            success: false, 
            message: 'Please fill all fields'
        });
    }else{
        dbConn.query('SELECT * FROM capno_users WHERE email = ? and id != ?', [req.body.email,req.params.id] , (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'DB error',
                    error: err
                })
            } else {
               if(result.length > 0){
                res.status(400).json({
                    success: false,
                    message: 'Account already exist with this email',
                })
               }
               else{
        Trainer.updateTrainer(req.params.id, data, (err, trainer)=>{
            if(err){
                res.status(500).json({
                    success: false,
                    message: 'DB error',
                    error: err
                })
            }
            else{
                res.status(200).json({
                    status: true,
                    message: 'Trainer updated Successfully',
                })
            }
           
           
        })
    }
}
        })
    }
}

// delete Trainer
exports.deleteTrainer = (req, res)=>{
    Trainer.deleteTrainer(req.params.id, (err, trainer)=>{
        if(err)
        res.send(err);
        res.json({success:true,
             message: 'Trainer deleted successully!'
        });
    })
}

