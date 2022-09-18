const md5 = require('md5');
const dbConn = require('../dbConnection')
 
var MultiReportSignals = function(report) {
  this.name = report.name
  
}

 
 
// get all Signals 
MultiReportSignals.getMultiReportSignalList = (data,result) => {
   
  dbConn.query('SELECT * FROM multi_report_sgnals  order by `id` asc',    (err, res) => {
      if (err) {
        result(err ,null);
      } else { 
        result(null, res)
      }
    })


} 


module.exports = MultiReportSignals