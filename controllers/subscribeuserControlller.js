
const dbConn = require('../dbConnection')

exports.allAccounts = (req, resp) => {

    dbConn.query('SELECT * FROM capno_users WHERE status = 1 and user_type = 1 ORDER BY firstname', (err, result) => {
        if (err)
            throw new Error(err)
        return resp.status(200).json({
            success: true,
            data:result
        })

    })
}


exports.subscribedAccounts = (req, resp) => {

    const seconds = new Date().getTime()/1e3;

    dbConn.query('SELECT * FROM capno_users WHERE expire_account > ? and status = 1 and user_type = 1 ORDER BY firstname',[seconds], (err, result) => {
        if (err)
            throw new Error(err)
        return resp.status(200).json({
            success: true,
            result
        })

    })
}

exports.subscriberUserList = (req, resp) => {

    const seconds = new Date().getTime()/1e3;

    dbConn.query('SELECT * FROM capno_users WHERE expire_account < ? and status = 1 and user_type = 1 ORDER BY firstname',[seconds], (err, result) => {
        if (err)
            throw new Error(err)
        return resp.status(200).json({
            success: true,
            result
        })

    })
}

exports.updateExpirydate = (req, resp)=>{
    console.log(req.body.expire_account)
    dbConn.query("UPDATE capno_users SET expire_account = ? WHERE id = ? ", [req.body.expire_account, req.params.id], (error, result) => {
        if (error) throw error;
        if (result) {
            resp.status(200).json({
                success: true,
                message: 'Expiry account changed successfully'
            })
        }
    });

}
exports.updateExpirydatebyYEAR = (req, resp)=>{
console.log(req.params.id)
    dbConn.query("SELECT * FROM capno_users WHERE id = ?",[req.params.id], (error, result) => {
        if (error) {      
            resp.status(500).json({
                success: false,
                error: error
            })
        }
        if(result[0].expire_account){
           console.log(result[0].expire_account)
           var currentexpireAccount = result[0].expire_account;
           const renewbyoneyear = parseInt(currentexpireAccount) + 365*86400;
           console.log(renewbyoneyear)
            dbConn.query("UPDATE capno_users SET expire_account = ? WHERE id = ? ", [renewbyoneyear, req.params.id], (error, finalResult) => {
                if(error){
                    console.log(error)
                    resp.status(500).json({
                        success: false,
                        error: error
                    })
                }
                if(finalResult){
                    resp.status(200).json({
                        success: true,
                        message: 'Renew Successfully'
                    })
                }
            })

        }

    });

}



exports.getExpireDate7days = (req, resp)=>{

   
     const seconds = new Date().getTime()/1e3;
     console.log(seconds)
     const sevendays = seconds + 7*86400;
     console.log(sevendays)
     

     dbConn.query('SELECT * FROM capno_users WHERE expire_account >= ? and expire_account <= ? and status = 1 and user_type = 1 ORDER BY firstname',[seconds,sevendays], (err, result) => {
        if (err)
            throw new Error(err)
        return resp.status(200).json({
            success: true,
            result
        })

    })

    
}
exports.getExpireDate30days = (req, resp)=>{

   
    const seconds = new Date().getTime()/1e3;
    const Thirtydays = seconds + 30*86400;
    console.log(Thirtydays)

    dbConn.query('SELECT * FROM capno_users WHERE expire_account >= ? and expire_account <= ? and status = 1 and user_type = 1 ORDER BY firstname',[seconds,Thirtydays], (err, result) => {
       if (err)
           throw new Error(err)
       return resp.status(200).json({
           success: true,
           result
       })

   })

   
}
