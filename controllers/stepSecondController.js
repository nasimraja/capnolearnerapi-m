const dbConn = require('../dbConnection')
const md5 = require('md5');

var allTrainerActive = "SELECT * FROM capno_users WHERE user_type = 2 AND status = ? AND associated_owner = md5('?')" // user_type, status, loggedIn_id
var singleTrainer = "SELECT * FROM capno_users WHERE user_type = 2 AND status = ? AND associated_practioner = md5('?')" // user_type, status, loggedIn_id
var singleClient = "SELECT * FROM capno_users WHERE user_type = ? AND status = 1 AND associated_practioner = md5('?')" // user_type, status, loggedIn_id

function getDependentData(req, res) {
    dbConn.query(allTrainerActive, (err, trainer) => {
        if(err) {
            console.log(err)
        } else {
            console.log(trainer)
        }
    })
}

getDependentData()




