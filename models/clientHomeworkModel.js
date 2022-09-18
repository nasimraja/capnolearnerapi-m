const dbConn = require('../dbConnection')
const md5 = require('md5')

var ClientHomework = function(clientHw) {
    this.cl_id = clientHw.cl_id
    this.file_name = clientHw.file_name
    this.file = clientHw.file
    this.status = clientHw.status
    this.sessionid = clientHw.sessionid
    this.added_on = clientHw.added_on
   
}


// // get all homework by session
// ClientHomework.getAllHomework = (data,result) => {
//     dbConn.query('SELECT homework.cl_id,client_session.name FROM homework LEFT JOIN client_session ON homework.sessionid = client_session.id WHERE sessionid = ? AND status = 1 AND deleted = 0',[md5(data.session_id)], (err, res) => {
//       if (err) {
//         result(err ,null);

//       } else {
//         result(null, res)
//       }
//     })
// } 


// delete homework by id
ClientHomework.deleteClientHomework = (id, result)=>{
  dbConn.query("UPDATE  homework  SET deleted = 1  WHERE id = ?", id, (err, res)=>{
      if(err){
          console.log('Error while deleting the Client Homework');
          result(err ,null);
      }else{
          console.log("Client Homework deleted successfully");
          result(null, res);
      }
  });
}




module.exports = ClientHomework 