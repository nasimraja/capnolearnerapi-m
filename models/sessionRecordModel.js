const md5 = require('md5');
const dbConn = require('../dbConnection')

 
var SessionRecord = function(session) {
    this.name = session.name
    this.number = session.number
    this.session = session.session
    this.created = new Date()
    this.updated = new Date()
}

// get all Client 
SessionRecord.getAllRecord = (data,result) => {
   
        dbConn.query('SELECT * FROM session_record WHERE session = ? order by `id` asc', [md5(data.session_id)],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    
  
} 
 
module.exports = SessionRecord