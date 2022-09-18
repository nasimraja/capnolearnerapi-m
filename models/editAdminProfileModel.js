const dbConn = require('../dbConnection')

const user_type = 1
var Owner = function(owner) {
    this.firstname = owner.firstname
    this.lastname = owner.lastname
    this.business = owner.business
    this.email = owner.email
    this.password = owner.password
    this.telephone = owner.telephone
    this.address = owner.address
    this.city = owner.city
    this.zipcode = owner.zipcode
    this.state = owner.state
    this.country = owner.country
    this.user_type = user_type
    this.created = new Date()
    this.modified = new Date()
}

// get all trainer 
Owner.getAllOwner = (result) => {
    dbConn.query('SELECT * FROM capno_users WHERE user_type=1', (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })
} 

// get owner by ID 
Owner.getOwnerById = (data,result) => {
  // console.log(data.id);
  dbConn.query('SELECT * FROM capno_users WHERE id= ?', [data.id], (err, res) => {
    if (err) {
      result(err ,null);
    } else {
      result(null, res)
    }
  })
} 



Owner.updateSubscriptionsDetails = (id, data, result) => {
  dbConn.query("UPDATE capno_users SET  autoupdate=?,autorenew=? WHERE id = ?  ", [
      data.autoupdate,
      data.autorenew,
      id
      ], (err, res)=>{
      if(err){
          console.log(err);
          result(err ,null);;
      }else{
          console.log("Admin Subscription updated successfully");
          result(null, res);
      }
  });
}

// update Owner Profile
Owner.ownerUpdate = (id, data, result) => {
    dbConn.query("UPDATE capno_users SET firstname=?,lastname=?,email=?,telephone=?,address=?,address2=?,city=?,zipcode=?,state=?,country=?,qfirst=?,qsecond=?,qthird=?,qfourth=?,qfifth=? WHERE id = ? AND user_type = 1", [
        data.firstname,
        data.lastname,
        data.email,
        data.telephone,
        data.address,
        data.address2,
        data.city,
        data.zipcode,
        data.state,
        data.country,
        data.qfirst,
        data.qsecond,
        data.qthird,
        data.qfourth,
        data.qfifth,
        id
        ], (err, res)=>{
        if(err){
            console.log(err);
            result(err ,null);;
        }else{
            console.log("Admin Profile updated successfully");
            result(null, res);
        }
    });
}

module.exports = Owner