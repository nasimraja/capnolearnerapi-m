const Client = require('../models/clientModel')
const dbConn = require('../dbConnection')
const sendEmail = require('./emailController')
const md5 = require('md5');


// get all Client list
exports.getClientList = (req, res) => {
    if(req.query.trainer === "true"){
        Client.getAllClientTrainer(req.query,(err, clients) => {
            if(err)
            throw new Error(err)
            return res.status(200).json({ 
                status: true, 
                clients
            })
        })
    }
    else{
        Client.getAllClientOwner(req.query,(err, clients) => {
            if(err)
            throw new Error(err)
            return res.status(200).json({ 
                status: true,
                clients
            })
        })
    }
   
}

 

// get Client by id
exports.getClientByID = (req,res) => {
    Client.getAllClientByID(req.params.id, (err, client) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            success: true,
            client
        })
    })
}

// create new Client
exports.createNewClient = (req, res) => {
    console.log(req)
    const data = new Client(req.body)

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
                Client.createNewClient(data, (err, Client) => {
                    if(err) {
                        res.send(err)
                        res.json({
                            success: false,
                            message: "Somothing went wrong",
                            data: Client
                        })
                    } else {
                        let email = true ; 
                        if(req.body.sendemail){
                            email  = sendEmail(req.body.firstname,req.body.email,3) ;
                                
                        }
                       
                            res.status(201).json({
                                success: true,
                                message: 'Client Inserted Successfully',
                                email: email,
                            })
                        
                        
                       
                    }
                })
               }
            }
          })
       
    }
}

// update Client
exports.updateClient = (req, res)=>{
    const data = new Client(req.body);
    console.log('data update', req.params);
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
                Client.updateClient(req.params.id, data, (err, Client)=>{
                    if(err)
                    res.send(err);
                    res.json({
                        status: true,
                        message: 'Client updated Successfully',
                    })
                })
               }
       

    }
})
}
}

exports.deactivateClient = (req, res)=>{
    Client.deactivateClient(req.params.id, (err, client)=>{
        if(err)
        res.send(err);
        res.json({success:true,
             message: 'Client updated successully!'
        });
    })
}

    exports.activateClient = (req, res)=>{
        Client.activateClient(req.params.id, (err, client)=>{
            if(err)
            res.send(err);
            res.json({success:true,
                 message: 'Client updated successully!'
            });
        })

    }
// delete Client
exports.deleteClient = (req, res)=>{
    Client.deleteClient(req.params.id, (err, client)=>{
        if(err)
        res.send(err);
        res.json({success:true,
             message: 'Client deleted successully!'
        });
    })
} 

