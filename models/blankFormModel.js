const dbConn = require('../dbConnection')
const md5 = require('md5')

var BlankForms = function(blankform) {
    this.forms = blankform.forms
    this.file = blankform.file
    this.type = blankform.type
    this.status = blankform.status
    this.added_on = blankform.added_on
}

// get all blank forms 
BlankForms.getAllForms = (type,result) => {
    dbConn.query('SELECT * FROM blank_forms  WHERE type = ? AND id != 4 AND status = 1 ORDER BY forms ASC',[type], (err, res) => {
      if (err) {
        result(err ,null);

      } else {
        result(null, res)
      }
    })
} 

 

module.exports = BlankForms