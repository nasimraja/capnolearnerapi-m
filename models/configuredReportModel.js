const md5 = require('md5');
const dbConn = require('../dbConnection')

 
var ConfiguredReport = function(report) {
    this.name = report.name
    this.status = report.status
    this.original = report.original
    this.byuser = report.byuser
    this.type = report.type
    this.created_at = new Date()
    this.updated_at = new Date()
}

 

// get all Config 
ConfiguredReport.getAllConfiguredReports = (data,result) => {
   
        dbConn.query('SELECT * FROM pre_configured_report WHERE   original = 0 AND  type = ?   order by `order` asc', [data.type],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    
  
} 
  

// get all Config 
ConfiguredReport.getAlternateReport = (data,result) => {
   
  dbConn.query('SELECT * FROM pre_configured_report WHERE   original = ? AND byuser = md5(?)  AND  type = ?   order by `id` asc', [data.original,data.user,data.type],  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })


} 


ConfiguredReport.saveAlternateReport = (data,result) => {
   
  dbConn.query('insert into  pre_configured_report  (name, original , byuser, type ) values (?,?,md5(?),?) ' , [data.name,data.original,data.user,data.type],  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })


} 



module.exports = ConfiguredReport