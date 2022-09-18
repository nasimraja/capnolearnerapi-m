const dbConn = require('../dbConnection')
const md5 = require('md5')

var ClientForms = function(cleintform) {
    this.cl_id = cleintform.cl_id
    this.form_name = cleintform.form_name
    this.form = cleintform.form
    this.status = cleintform.status
    this.added_on = cleintform.added_on
}

// get all blank forms 
// ClientForms.getAllForms = (data,result) => {
//   console.log(data.client_id)
//     dbConn.query('SELECT client_form.cl_id,client_form.form_name,client_form.form,client_form.status,client_form.added_on,blank_forms.forms FROM client_form LEFT JOIN blank_forms ON client_form.form_name = blank_forms.id  WHERE cl_id = ?  AND  client_form.status = 1  and deleted = 0 ',[md5(data.client_id)], (err, res) => {
//       if (err) {
//         result(err , null)
//       } else {
//         result(null, res)
//       }
//     })
// } 


 
ClientForms.deleteClientForm = (id, result)=>{
  dbConn.query("UPDATE client_form  SET deleted = 1 WHERE id = ?", id, (err, res)=>{
      if(err){
          console.log('Error while deleting the Client Form');
          result(err, null);
      }else{
          console.log("Client Form deleted successfully");
          result(null, res);
      }
  });
}


module.exports = ClientForms