const dbConn = require('../dbConnection')
const md5 = require('md5')


 
var HardwareProfileSix = function(hardware) {
  this.serial_key = hardware.serial_key
  this.internal_id = hardware.internal_id
  this.owner_id =  md5(hardware.owner_id)
  this.owner = md5(hardware.owner_id)
  this.date_activated = Math.round(new Date().getTime()/1e3)
  this.distributer = hardware.distributer
  this.downlaoded = hardware.downlaoded
  this.status = hardware.status
  this.created =  Math.round(new Date().getTime()/1e3)
}

 
// get all harwareprofile 
HardwareProfileSix.getHardwareProfileListSix = (data,result) => {
  dbConn.query('SELECT * FROM owner_serial_six where owner_id = ? ', md5(data.owner) ,  (err, res) => {
    if (err) {
      result(err ,null);
    } else {
      result(null, res)
    }
  })
} 


 

module.exports = HardwareProfileSix