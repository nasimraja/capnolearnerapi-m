const dbConn = require('../dbConnection')
const md5 = require('md5')

var TrainerForms = function(trainerFrom) {
    this.clientid = trainerFrom.clientid
    this.sessid = trainerFrom.sessid
    this.form = trainerFrom.form
    this.status = trainerFrom.status
    this.added_on = trainerFrom.added_on
}

// get all blank forms 
// TrainerForms.getAllForms = (data,result) => {
//     dbConn.query('SELECT * FROM practioner_form   where clientid = ?  AND  status = 1   and deleted = 0  ',[md5(data.client_id)], (err, res) => {
//       if (err) {
//         result(err, null)
//       } else {
//         result(null, res)
//       }
//     })

    
 
// } 

TrainerForms.deleteTrainerForm = (id, result)=>{
  dbConn.query("UPDATE practioner_form SET deleted = 1  WHERE id = ?", id, (err, res)=>{
      if(err){
          console.log('Error while deleting the Trainer Form');
          result(err , null);
      }else{
          console.log("Trainer Form deleted successfully");
          result(null, res);
      }
  });
}
module.exports = TrainerForms