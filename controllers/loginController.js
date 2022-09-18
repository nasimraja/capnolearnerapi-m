const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const dbConn = require('../dbConnection')
const conn = require('../dbConnection').promise();
const md5 = require('md5');

exports.login = async (req,res,next) =>{
    const errors = validationResult(req);
    // console.log(req)
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        const [row] = await conn.execute(
            "SELECT * FROM `capno_users` WHERE `email`=?",
            [req.body.email]
          );

        if (row.length === 0) {
            return res.status(422).json({
                message: "Invalid email address",
            });
        }
        else{
            
        const [rowResult] = await conn.execute(
            "SELECT * FROM `capno_users` WHERE `email`=? and BINARY `password` = ? and `status` = 1",
            [req.body.email,req.body.password]
          );
          if (rowResult.length === 0) {
            return res.status(422).json({
                message: "Invalid Login Credentials",
            });
        }
        else{
            const token = jwt.sign(
                { user_id: rowResult[0].id, email: rowResult[0].email },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "2h",
                }
              );
              let associated_owner =  md5(rowResult[0].id.toString());
            //   console.log(md5(2));
              let associated_practioner = md5(rowResult[0].id.toString());
            
            if(rowResult[0].user_type > 1){
                associated_owner = rowResult[0].associated_owner
            }
              
            return res.json({
                status: true,
                user_id: rowResult[0].id,
                user_type: rowResult[0].user_type,
                associated_owner: associated_owner,
                associated_practioner:  associated_practioner,
                accessToken: token
            });
        }
         

        }

        // const passMatch = await bcrypt.compare(req.body.password, row[0].password);
        // if(!passMatch){
        //     return res.status(422).json({
        //         message: "Incorrect password",
        //     });
        // }

        // const theToken = jwt.sign({id:row[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });

      

    }
    catch(err){
        next(err);
    }
}


async function sendMail(toAddress, subject, text, html) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER, // generated ethereal user
            pass: process.env.SMTP_PASS, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"tic toc" <>', // sender address
        to: toAddress, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);

}

exports.forgotpassword = (req, resp) => {
    console.log(req.body.email)
    dbConn.query('SELECT * FROM capno_users WHERE email = ?', [req.body.email], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'DB error'
            })
        } else {
            if (result.length > 0) {
                const random = (Math.random() + 1).toString(36).substring(7);
                sendMail(
                    result[0].email,
                    'password reset request',
                    'You recently requested to reset password.',
                    'You recently requested to reset password.',
                    '<p>Please click here to <a href="http://localhost:3000/reset/password/"> reset</a> your password</p>'


                );
                console.log(result[0].id)
                dbConn.query("UPDATE capno_users SET resetpassword = ? WHERE id = ? ", [random, result[0].id], (error, result) => {
                    if (error) throw error;
                    if (result) {
                        resp.status(200).json({
                            success: true,
                            message: 'token inserted'
                        })
                    }
                });

            }
            else {
                resp.status(400).json({
                    success: false,
                    message: 'your email not exit my database',
                })
            }
        }

    })
}

exports.updatepass = (req, resp) => {

    dbConn.query('SELECT * FROM capno_users WHERE resetpassword = ?', [req.body.resetpassword], (error, result) => {

        if (error) {
            resp.status(500).json({
                success: false,
                message: 'DB error',
            })
        } else {

            if (result) {
                console.log(req.body.pass)
                console.log(req.body.resetpassword)
                dbConn.query("UPDATE capno_users SET pass = ? WHERE resetpassword = ? ", [req.body.pass, req.body.resetpassword], (error, updatedresult) => {
                    if (error) throw error;
                    if (updatedresult) {
                        resp.status(200).json({
                            success: true,
                            message: 'password updated'
                        })
                    }
                });

            } else {
                resp.status(400).json({
                    success: false,
                    message: 'back to home page',
                })
            }
        }
    })
}