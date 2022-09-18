const Group = require('../models/groupModel')
const dbConn = require('../dbConnection')
const md5 = require('md5')

// get all Group list
exports.getGroupList = (req, res) => {
    Group.getAllGroup((err, groups) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            success: true,
            groups
        })
    })
}

// get Group by id
exports.getGroupByID = (req,res) => {
    Group.getAllGroupByID(req.params.id, (err, group) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            success: true,
            group
        })
    })
}

exports.getGroupProfileByGroupID = (req,res) => {
    Group.getAllGroupProfileByGroupID(req.params.id, (err, groupProfile) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            success: true,
            groupProfile
        })
    })
}

// create new Group
exports.createNewGroup = (req, res) => {
    // console.log(req.body)
    const data =  req.body ;

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        })
    } else {
        dbConn.query('SELECT * FROM capno_users WHERE email = ?', [data.email] , (err, checkResult) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'DB error',
                })
            } else {
               if(checkResult.length == 0){

              
        let groupProfile = {} ;
        groupProfile['firstname']  = data.name ;
        groupProfile['email']  = data.email ;
        groupProfile['password']  = data.password; 
        groupProfile['associated_owner']  = data.associated_owner ;
        groupProfile['associated_practioner']  = md5(data.associated_practioner) ;
        groupProfile['user_type']  = 4 ;
        groupProfile['device']  = data.device_type ;
        groupProfile['status']  = 1 ;
        let success = true ;
        dbConn.query('INSERT INTO capno_users SET ? ', groupProfile, (err, result) => {
            if (err) {
                success = false
                res.json({
                    success: success,
                    message: "DB Error",
                    data: err
                })
            }
            else {
                success = false
           let arrayData = [] ;
        data.devices.map((v,i) => {
            arrayData.push([md5(result.insertId.toString()),v.name,v.serialnumber]);
        })

        var sql = "INSERT INTO groupprofile (groupid, name, serialnumber) VALUES ?";
        dbConn.query(sql, [arrayData], (err, result) => {
            if (err) {
                res.status(200).json({
                    success: false,
                    message: err
                })
            } else {
                res.status(201).json({
                    success: true,
                    message: 'Group Inserted Successfully'
                })
            }
        })
     
        
        
        }

    })
 

}
else{
    res.status(200).json({
        success: false,
        message: 'An Account with Email already Exist'
    })
}
}
})
        
    }
}




// update Group Profile
exports.updateGroupProfile = (req, res)=>{
    const data =  req.body;
    // console.log('data update', data);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({
            success: false, 
            message: 'Please fill all fields'
        });
    }else{
       
        Group.updateGroupProfile(req.params.id, data, (err, group)=>{
            if(err){
                res.status(400).json({

                    status: false,
                    message: err,
                })
            }
            else{
                res.status(200).json({
                    status: true,
                    message: 'Group Profile updated Successfully',
                })
            }
        
    
        })
    
}
    }

 

// update Group
exports.updateGroup = (req, res)=>{
    const data =  req.body;
    // console.log('data update', data);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({
            success: false, 
            message: 'Please fill all fields'
        });
    }else{
        dbConn.query('SELECT * FROM capno_users WHERE email = ? and id != ?', [data.email,req.params.id] , (err, checkResult) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'DB error',
                })
            } else {
               if(checkResult.length == 0){
        Group.updateGroup(req.params.id, data, (err, group)=>{
            if(err){
                res.status(200).json({

                    status: false,
                    message: err,
                })
            }
            else{
                res.status(200).json({
                    status: true,
                    message: 'Group updated Successfully',
                })
            }
        
    
        })
    }
    else{
        res.status(200).json({
            success: false,
            message: 'An Account with Email already Exis',
        })
    }
}
    })
}
}

// delete Group
exports.deleteGroup = (req, res)=>{
    Group.deleteGroup(req.params.id, (err, group)=>{
        if(err)
        res.send(err);
        res.json({success:true,
             message: 'Group deleted successully!'
        });
    })
}

