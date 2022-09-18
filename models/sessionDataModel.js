const dbConn = require('../dbConnection')
const md5 = require('md5')

var SessionData = function(session) {
    this.sessionid = session.sessionid
    this.signal_type = session.signal_type
    this.record = session.record
    this.recordName = session.recordName
    this.data_type = session.data_type
    this.sessiondata = session.sessiondata
    this.recordLength = session.recordLength
    this.created = session.created
    this.updated_at = session.updated_at
}

// get all session data 
SessionData.getAllData = (data,result) => {
    dbConn.query('SELECT * FROM capno_data where sessionid = ? ',[md5(data.session_id)], (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })
} 
// SessionData all Client 
SessionData.getAllDataByType = (data,result) => {
   if(data.type == 2){
    dbConn.query('SELECT * FROM capno_data WHERE   sessionid = ? AND  data_type = ?   order by `id`  desc LIMIT 0,1', [md5(data.session_id) ,data.type],  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })
   }
   else{
    dbConn.query('SELECT * FROM capno_data WHERE   sessionid = ? AND  data_type = ?   order by `id`  desc', [md5(data.session_id) ,data.type],  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })
   }
 


} 
// get all session signal wise data 
SessionData.getSignalData = (data,result) => {
    dbConn.query('SELECT * FROM capno_data where signal_type = ? AND sessionid = ? AND data_type = 1',[data.signal_name,md5(data.session_id)], (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })
} 
  

module.exports = SessionData