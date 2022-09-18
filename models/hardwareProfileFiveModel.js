const dbConn = require('../dbConnection')
const md5 = require('md5')


var HardwareProfileFive = function(hardware) {
    this.serial_key = hardware.serial_key
    this.owner_id =  md5(hardware.owner_id)
    this.owner = md5(hardware.owner_id)
    this.date_activated = Math.round(new Date().getTime()/1e3)
    this.status = hardware.status
    this.created =  Math.round(new Date().getTime()/1e3)
}

 


// get all harwareprofile 
HardwareProfileFive.getAllHardwareProfileFive = (data,result) => {
    dbConn.query('SELECT * FROM owner_serial where owner_id = ? and deleted = 0 ', md5(data.owner) ,  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })
} 




// create hardware profile 5
HardwareProfileFive.registerHardwareProfileFive = (data, result) => {
  dbConn.query("insert into owner_serial SET  ?  ", [
      data
      ], (err, res)=>{
      if(err){
          // console.log('Error while updating the Hardware Profile');
          result(err ,null);;
      }else{
          // console.log("Hardware Profile updated successfully");
          result(null, res);
      }
  });
}


// update hardware profile
HardwareProfileFive.updateHardwareProfileFive = (id, data, result) => {
  dbConn.query("UPDATE owner_serial SET serial_key=? , status = ? WHERE id = ?", [
      data.serial_key,  
      data.status,  
      id
      ], (err, res)=>{
      if(err){
          console.log('Error while updating the Hardware Profile');
          result(err ,null);;
      }else{
          console.log("Hardware Profile updated successfully");
          result(null, res);
      }
  });
}



// Delete hardware profile
HardwareProfileFive.deleteHardwareProfileFive = (id, result)=>{
  dbConn.query("UPDATE owner_serial SET deleted = 1 WHERE id = ?", id, (err, res)=>{
      if(err){
          console.log('Error while deleting the Group');
          result(err,null);
      }else{
          console.log("Hardware Profile deleted successfully");
          result(null, res);
      }
  });
}


module.exports = HardwareProfileFive