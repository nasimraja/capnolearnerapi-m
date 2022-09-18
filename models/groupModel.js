const dbConn = require('../dbConnection')
const md5 = require('md5')

var Group = function(group) {
    this.groupid = md5(group.groupid)
    this.name = group.name
    this.serialnumber = group.serialnumber
}

// get all Group 
Group.getAllGroup = (result) => {
    dbConn.query('SELECT * FROM groupprofile', (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })
} 




// get Group Profiles by ID
Group.getAllGroupProfileByGroupID = (id, result) => {
    dbConn.query('SELECT * FROM groupprofile  where groupid =  ?', md5(id), (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}

// get Group by ID
Group.getAllGroupByID = (id, result) => {
    dbConn.query('SELECT g.firstname as group_name, g.email,g.device,g.status,g.associated_practioner FROM capno_users as g LEFT JOIN  capno_users as p on md5(p.id) = g.associated_practioner where g.id=?', id, (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}

// create new Group
Group.createNewGroup = (data, result) => {
    dbConn.query('INSERT INTO groupprofile SET ? ', data, (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}



// update Group Profile
Group.updateGroupProfile = (id, data, result) => {
 
    dbConn.query("UPDATE groupprofile SET name=?,serialnumber=? WHERE id = ?", [
        data.name,
        data.serialnumber,
        id
        ], (err, res)=>{
        if(err){
            console.log('Error while updating the Group');
            console.log(err);
            result(err ,null);;
        }else{
            console.log("Group updated successfully");
            result(null, res);
        }
    });
}

// update Group
Group.updateGroup = (id, data, result) => {
    // console.log("UPDATE capno_users SET firstname="+data.name+",email="+data.email+",associated_practioner="+md5(data.associated_practioner)+",device="+data.device+",status="+data.status+" WHERE id = "+id);
    dbConn.query("UPDATE capno_users SET firstname=?,email=?,associated_practioner=?,device=?,status=? WHERE id = ?", [
        data.name,
        data.email,
        md5(data.associated_practioner),
        data.device_type,
        data.status,
        id
        ], (err, res)=>{
        if(err){
            console.log('Error while updating the Group');
            console.log(err);
            result(err, null);
        }else{
            console.log("Group updated successfully");
            result(null, res);
        }
    });
}

// Delete Group
Group.deleteGroup = (id, result)=>{
    dbConn.query("UPDATE capno_users SET deleted = 1 WHERE id = ? and user_type = 4", id, (err, res)=>{
        if(err){
            console.log('Error while deleting the Group');
            result(err,null );
        }else{
            console.log("Group deleted successfully");
            result(null, res);
        }
    });
}

module.exports = Group