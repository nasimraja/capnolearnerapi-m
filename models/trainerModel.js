const dbConn = require('../dbConnection')
const md5 = require('md5');

const user_type = 2
const status = 1 

var Trainer = function(trainer) {
    this.firstname = trainer.firstname
    this.lastname = trainer.lastname
    this.profession = trainer.profession
    this.degreescompleted = trainer.degreescompleted
    this.year_exp = trainer.year_exp
    this.email = trainer.email
    this.license = trainer.license
    this.certificationscompleted = trainer.certificationscompleted
    this.email = trainer.email
    this.telephone = trainer.telephone 
    this.address = trainer.address
    this.address2 = trainer.address2
    this.city = trainer.city
    this.state = trainer.state
    this.country = trainer.country
    this.zipcode = trainer.zipcode
    this.login = new Date()
    this.status = status
    this.created = new Date()
    this.modified = new Date()
    this.associated_owner = trainer.associated_owner
    this.user_type = user_type 

    if (typeof trainer.password === 'undefined' ||  trainer.password == '') {
        trainer.password = 111111 + Math.floor(Math.random() * 999999);
    }

    this.password = trainer.password

}

// get all trainer 
Trainer.getAllTrainer = (data,result) => {
    if(data.list){
        dbConn.query('SELECT * FROM capno_users WHERE   (associated_owner = ? and user_type=2 ) and deleted = 0 order by `firstname` asc', [md5(data.user_id),data.user_id],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    }
    else{
        if(data.status){
            dbConn.query('SELECT * FROM capno_users WHERE   status = ? and deleted = 0  AND ((associated_owner = ? and user_type=2 ) OR ( id = ? and user_type=1  )) order by `firstname` asc', [data.status , md5(data.user_id),data.user_id],  (err, res) => {
                if (err) {
                  result(err ,null);
                } else {
                  result(null, res)
                }
              })
        }
        else{
            dbConn.query('SELECT * FROM capno_users WHERE   ((associated_owner = ? and user_type=2 ) OR ( id = ? and user_type=1  )) and deleted = 0 order by `firstname` asc', [md5(data.user_id),data.user_id],  (err, res) => {
                if (err) {
                  result(err ,null);
                } else {
                  result(null, res)
                }
              })
        }
    }
   
  
} 

 


Trainer.getSingleTrainer = (result) => {
    dbConn.query('SELECT * FROM capno_users WHERE user_type=2 AND status = 2', (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })
} 

// get Trainer by ID
Trainer.getAllTrainerByID = (id, result) => {
    console.log(id , "SELECT * FROM capno_users WHERE id=? AND user_type=2")
    dbConn.query('SELECT * FROM capno_users WHERE id=? AND user_type=2', id, (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}

// create new Trainer
Trainer.createNewTrainer = (data, result) => {
    dbConn.query('INSERT INTO capno_users SET ? ', data, (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}

// update Trainer
Trainer.updateTrainer = (id, result) => {
    dbConn.query("UPDATE capno_users SET firstname=?,lastname=?,profession=?,degreescompleted=?,year_exp=?,certificationscompleted=?,license=?,email=?,city=?,state=?,country=?,zipcode=?,telephone=?,address=?,address2=?,associated_owner=?  WHERE id = ? AND user_type=2", [
        data.firstname,
        data.lastname,
        data.profession,
        data.degreescompleted,
        data.year_exp,
        data.certificationscompleted,
        data.license,
        data.email,
        data.city,
        data.state,
        data.country,
        data.zipcode,
        data.telephone,      
        data.address,
        data.address2,  
        data.associated_owner,
        id
        ], (err, res)=>{
        if(err){
            console.log('Error while updating the Trainer');
            console.log(err);
            result(err,res);
        }else{
            console.log("Trainer updated successfully");
            result(err,res);
        }
    });
}


// Activate Trainer
Trainer.activateTrainer = (id, result)=>{
    dbConn.query("UPDATE capno_users SET status = 1 WHERE id = ? and user_type =2", id, (err, res)=>{
        if(err){
            console.log('Error while deleting the Trainer');
            result(err, null);
        }else{
            console.log("Trainer updated successfully");
            result(null, res);
        }
    });
}



// Deactivate Trainer
Trainer.deactivateTrainer = (id, result)=>{
    dbConn.query("UPDATE capno_users SET status = 0 WHERE id = ? and user_type =2", id, (err, res)=>{
        if(err){
            console.log('Error while deleting the Trainer');
            result(err, null);
        }else{
            console.log("Trainer updated successfully");
            result(null, res);
        }
    });
}


// Delete Trainer
Trainer.deleteTrainer = (id, result)=>{
    dbConn.query("UPDATE capno_users SET deleted = 1 WHERE id = ? and user_type =2", id, (err, res)=>{
        if(err){
            console.log('Error while deleting the Trainer');
            result(err, null);
        }else{
            console.log("Trainer deleted successfully");
            result(null, res);
        }
    });
}

module.exports = Trainer