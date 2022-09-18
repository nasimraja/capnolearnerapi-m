const md5 = require('md5');
const dbConn = require('../dbConnection')

 
var SingleSessionPdf = function(pdf) {
    this.session_id = pdf.session_id
    this.pdf_name = pdf.pdf_name
    this.data = pdf.data
    this.type = pdf.type
    this.status = pdf.status
    this.added_on = new Date()
}

// get all Client 
SingleSessionPdf.getAllPdf = (data,result) => {
   
        dbConn.query('SELECT session_data_report_pdf.pdf_name,session_data_report_pdf.id,session_data_report_pdf.added_on,client_session.name FROM session_data_report_pdf LEFT JOIN client_session ON session_data_report_pdf.session_id = client_session.id WHERE  session_id = ? ', [data.session_id],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    
  
} 
 
module.exports = SingleSessionPdf