const md5 = require('md5');
const dbConn = require('../dbConnection')

 
var Session = function(session) {
    this.name = session.name
    this.hw = session.hw
    this.cid = session.cid
    this.zoom_link = session.zoom_link
    this.created = new Date()
}

// get all Client 
Session.getAllSession = (data,result) => {
   
        dbConn.query('SELECT * FROM client_session WHERE   cid = ? AND  hw = ?   order by `id` desc', [md5(data.cid) ,data.hw],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    
  
}

Session.getSessionbyClientId = (data,result) => {
   
  dbConn.query('SELECT * FROM client_session WHERE  cid = ?   order by `id` desc', [md5(data.cid)],  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })


} 


// get all Client 
Session.getSessionInfo = (data,result) => { 
   
  dbConn.query('SELECT client_session.* ,   client.firstname as client_firstname, client.lastname as client_lastname, trainer.firstname as trainer_firstname ,trainer.lastname as trainer_lastname FROM    client_session as client_session LEFT JOIN capno_users as client on md5(client.id) =  client_session.cid LEFT JOIN capno_users as trainer on md5(trainer.id) = client.associated_practioner WHERE   client_session.id = ? ', [data.session_id],  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })


} 






Session.updateZoomLink = (id,data,result) => {
   
  dbConn.query("UPDATE client_session SET  zoom_link=? WHERE id = ?  ", [
    data.zoom_link,
    id
    ], (err, res)=>{
    if(err){
        console.log(err);
        result(err ,null);;
    }else{
        console.log("Zoom link updated successfully");
        result(null, res);
    }
});

} 


Session.getClientInfo = (data,result) => {
   
  dbConn.query('SELECT   client.firstname as client_firstname, client.lastname as client_lastname, trainer.firstname as trainer_firstname ,trainer.lastname as trainer_lastname FROM    capno_users as client   LEFT JOIN capno_users as trainer on md5(trainer.id) = client.associated_practioner WHERE   client.id = ?   order by client.`id` desc', [data.cid ],  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })


} 
 
module.exports = Session