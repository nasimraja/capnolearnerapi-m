
const dbConn = require('../dbConnection')

exports.getonlineAccessList = (req, resp) => {

    dbConn.query('SELECT * FROM capno_users WHERE onlineAccess = 0', (err, result) => {
        if (err)
            throw new Error(err)
        return resp.status(200).json({
            success: true,
            data: result
        })

    })
}

exports.getEmail = (req, res) => {

    console.log(req.params.email)
    dbConn.query('select * from `capno_users` where email = ?', [req.params.email], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                success: false,
                message: 'err',
            })
        } else {
            if (result.length == 0) {

                res.status(200).json({
                    success: false,
                    message: 'No Email Found',
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    data: result,
                })
            }
        }
    })

}


exports.updateonlineAccessByemail = (req, res) => {

    const data = [req.body.onlineAccess, req.params.email];
    console.log(req.params.email)
    console.log(req.body.onlineAccess)

    dbConn.query('UPDATE capno_users SET onlineAccess = ? WHERE email = ?', data, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                success: false,
                message: 'err',
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Updated Successfully",
            })
        }
    })

}

exports.getDomains = (req, res) => {

    // let domains = '@'+req.params.domains; 
    console.log(req.params.domains)
    dbConn.query("select * from `capno_users` WHERE email  LIKE  '%" + "@" + req.params.domains + "%'", (err, result) => {
        if (err) {

            res.status(500).json({
                success: false,
                message: 'DB error',
            })
        } else {
            if (result.length == 0) {
                res.status(200).json({
                    success: false,
                    message: 'No Email Found',
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    data: result,
                })
            }
        }
    })



}

exports.updateonlineAccessBydomain = (req, res) => {

    const data = [req.body.onlineAccess];
    console.log(req.params.domain)
    console.log(req.body.onlineAccess)
    dbConn.query("UPDATE capno_users SET onlineAccess = ?  WHERE email  LIKE  '%" + "@" + req.params.domain + "%'",[data], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                success: false,
                message: 'err',
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Updated Successfully",
            })
        }
    })

}

exports.updateonlineAccess = (req, resp)=>{
    console.log(req.params.id)
    dbConn.query("UPDATE capno_users SET onlineAccess = 1 WHERE id = ? ", [req.params.id], (error, result) => {
        if (error) throw error;
        if (result) {
            resp.status(200).json({
                success: true,
                message: 'Updated online access successfully'
            })
        }
    });

}

