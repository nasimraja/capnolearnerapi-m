const dbConn = require('../dbConnection')


var Recording = function(recording) {
    this.recordingname = recording.recordingname
    this.recording_type = recording.recording_type
    this.status = recording.status
}
// get all recording 
Recording.getAllRecording = (result) => {
    dbConn.query('SELECT * FROM recordingc', (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })
} 

module.exports = Recording