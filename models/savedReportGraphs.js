const md5 = require('md5');
const dbConn = require('../dbConnection')

 
var SavedReportGraphs = function(report) {
    this.session_id = report.session_id
    this.pid = report.pid
    this.name = report.name
    this.notes = report.notes
    this.pdf = report.pdf
    this.status = report.status
    this.timezone = report.timezone
    this.added_on = new Date()
}

 

// get all Config 
SavedReportGraphs.getAllGraph = (data,result) => {
   
        dbConn.query('SELECT * FROM client_session_report_graphs WHERE    rid = ?   order by `graph_order` asc', [data.report_id],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    
  
} 
  


module.exports = SavedReportGraphs