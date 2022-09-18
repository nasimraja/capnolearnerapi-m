const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

const fetch = require("node-fetch");
const BlankForms = require('../models/blankFormModel')
const ClientForms = require('../models/clientFormModel')
const TrainerForms = require('../models/trainerFormModel')
const ClientHomework = require('../models/clientHomeworkModel')
const jsftp = require("jsftp");
const fs = require("fs");
require('dotenv').config()
const busboy = require('connect-busboy');
const dbConn = require('../dbConnection')
const md5 = require('md5')
const formidable = require('formidable');

const Ftp = new jsftp({
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT, // defaults to 21
    user: process.env.FTP_USER, // defaults to "anonymous"
    pass: process.env.FTP_PASS // defaults to "@anonymous"
});

// get all blank form
exports.getAllForm = (req, res) => {

    BlankForms.getAllForms(req.params.type, (err, forms) => {
        if (err)
            throw new Error(err)
        return res.status(200).json({
            status: true,
            forms
        })
    })


}



// get all client form

exports.getAllBlankForm = (req, resp) => {
    dbConn.query('SELECT * FROM blank_forms  WHERE status = 1 ORDER BY forms ASC', (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
        else {
            resp.status(200).json({
                success: true,
                data: result
            })
        }
    })
}

exports.getClientForm = (req, res) => {
    ClientForms.getAllForms(req.query, (err, forms) => {
        if (err)
            throw new Error(err)
        return res.status(200).json({
            status: true,
            forms
        })
    })



}



// get all client form
exports.getTrainerForm = (req, res) => {

    TrainerForms.getAllForms(req.query, (err, forms) => {
        if (err)
            throw new Error(err)
        return res.status(200).json({
            status: true,
            forms
        })
    })



}

exports.getClientListForm = (req, resp) => {

    if(req.params.cl_id != "null"){
        console.log(req.params.cl_id)

        dbConn.query('SELECT client_form.id ,client_form.cl_id,client_form.form_name,client_form.form,client_form.status,client_form.added_on,blank_forms.forms FROM client_form LEFT JOIN blank_forms ON client_form.form_name = blank_forms.id  WHERE cl_id = ?  AND  client_form.status = 1 AND deleted = 0 ', [md5(req.params.cl_id)], (err, result) => {
            if (err) {
                resp.status(500).json({
                    success: false,
                    message: 'Something went wrong'
                })
            }
    
            if (result) {
                resp.status(200).json({
                    success: true,
                    data: result,
    
    
                })
            }
        })
    }
   



}

exports.getTrainerListForm = (req, resp) => {

    dbConn.query('SELECT  practioner_form.form,practioner_form.sessid,client_session.name as session_name, practioner_form.id,practioner_form.clientid,practioner_form.form_name,blank_forms.forms FROM practioner_form LEFT JOIN blank_forms ON practioner_form.form_name = blank_forms.id LEFT JOIN client_session ON practioner_form.sessid = client_session.id  WHERE practioner_form.clientid = ?  AND  practioner_form.status = 1  and practioner_form.deleted = 0', [req.params.clientid], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }

        if (result) {
            resp.status(200).json({
                success: true,
                data: result,




            })
        }
    })

}


exports.getClientHomework = (req, resp) => {

    console.log(req.params.cl_id)
    let query = 'SELECT homework.* , client_session.name as session_name FROM homework LEFT JOIN client_session ON homework.sessionid = md5(client_session.id) WHERE homework.cl_id = ?  AND  homework.status = 1  AND homework.deleted = 0' ; 
    let param = [md5(req.params.cl_id)] ; 
    // if(req.params.session_id == "null") {
    //     query = 'SELECT homework.* , client_session.name as session_name FROM homework LEFT JOIN client_session ON homework.sessionid = md5(client_session.id) WHERE   homework.status = 1  AND homework.deleted = 0' ;
    //     param = []
    // }
    console.log(query);
    console.log(param);
    dbConn.query(query, param, (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }

        if (result[0]) {

            dbConn.query('SELECT * FROM client_session WHERE FIND_IN_SET (md5(id), ?)', [result[0].sessionid], (error, sessionResult) => {
                if (error) {
                    resp.status(500).json({
                        success: false,
                        message: 'Something went wrong'
                    })
                }
                if (sessionResult[0]) {
                    dbConn.query('SELECT * FROM capno_users WHERE md5(id) = ?', [sessionResult[0].cid], (err, getclientResult) => {
                        if (err) {
                            resp.status(500).json({
                                success: false,
                                message: 'Something went wrong'
                            })
                        }
                        else {
                            resp.status(200).json({
                                success: true,
                                data: result,
                                ClientName: getclientResult[0].firstname + " " + getclientResult[0].lastname,



                            })
                        }


                    })
                }
            })
        }
    })


}

exports.uploadClientHomework = (req, res) => {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {

        var oldpath = files.form.filepath;
        var fileName = files.form.originalFilename
        let _name = Math.floor(Math.random() * 100).toString() + new Date().getTime().toString() + fileName.replace(/\s+/g, "-");
        let _remote = "/homework/" + _name;
        fs.readFile(oldpath, function (err, buffer) {
            if (err) {
                console.error(err);

            }
            else {
                Ftp.put(buffer, _remote, err => {

                    if (err) {
                        throw new Error(err)
                    }
                    else {
                        dbConn.query('INSERT INTO `homework`( `cl_id`, `file_name`, `file`, `status` , `sessionid` ) VALUES (?,?,?,1,?) ', [md5(fields.client_id), _name, _name, md5(fields.session_id)], (err, result) => {
                            if (err) {
                                return res.status(200).json({
                                    status: false,
                                    message: "not uploaded"
                                })
                            } else {
                                return res.status(200).json({
                                    status: true,
                                    message: "uploaded"
                                })
                            }
                        })
                    }
                });
            }
        });
    });


}

exports.uploadClientForm = (req, res) => {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {

        var oldpath = files.form.filepath;
        var fileName = files.form.originalFilename
        let _name = Math.floor(Math.random() * 100).toString() + new Date().getTime().toString() + fileName.replace(/\s+/g, "-");
        let _remote = "/client_forms/" + _name;
        fs.readFile(oldpath, function (err, buffer) {
            if (err) {
                console.error(err);

            }
            else {
                Ftp.put(buffer, _remote, err => {

                    if (err) {
                        throw new Error(err)
                    }
                    else {
                        dbConn.query('INSERT INTO `client_form`( `cl_id`, `form_name`, `form`, `status`) VALUES (?,?,?,1) ', [md5(fields.client_id), fields.form_id, _name], (err, result) => {
                            if (err) {
                                return res.status(200).json({
                                    status: false,
                                    message: "not uploaded"
                                })
                            } else {
                                return res.status(200).json({
                                    status: true,
                                    message: "uploaded"
                                })
                            }
                        })
                    }
                });
            }
        });
    });


}


exports.uploadTrainerForm = (req, res) => {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {

        var oldpath = files.form.filepath;
        var fileName = files.form.originalFilename
        let _name = Math.floor(Math.random() * 100).toString() + new Date().getTime().toString() + fileName.replace(/\s+/g, "-");
        let _remote = "/practioner_forms/" + _name;
        fs.readFile(oldpath, function (err, buffer) {
            if (err) {
                console.error(err);

            }
            else {
                Ftp.put(buffer, _remote, err => {

                    if (err) {
                        throw new Error(err)
                    }
                    else {
                        dbConn.query('INSERT INTO `practioner_form`( `clientid`,`sessid`, `form_name`, `form`, `status`) VALUES (?,?,?,?,1) ', [fields.client_id, fields.session_id, fields.form_id, _name], (err, result) => {
                            if (err) {
                                return res.status(200).json({
                                    status: false,
                                    message: "not uploaded"
                                })
                            } else {
                                return res.status(200).json({
                                    status: true,
                                    message: "uploaded"
                                })
                            }
                        })
                    }
                });
            }
        });
    });


}

exports.deleteClientForm = (req, res) => {
    ClientForms.deleteClientForm(req.params.id, (err, group) => {
        if (err)
            res.send(err);
        res.json({
            success: true,
            message: 'Client Form deleted successully!'
        });
    })
}

exports.deleteTrainerForm = (req, res) => {
    TrainerForms.deleteTrainerForm(req.params.id, (err, group) => {
        if (err)
            res.send(err);
        res.json({
            success: true,
            message: 'Trainer Form deleted successully!'
        });
    })
}

exports.deleteClientHomework = (req, res) => {
    ClientHomework.deleteClientHomework(req.params.id, (err, group) => {
        if (err)
            res.send(err);
        res.json({
            success: true,
            message: 'Client Homework deleted successully!'
        });
    })
}


exports.getblankPdfbyid = (req, resp) => {

    dbConn.query('SELECT * FROM blank_forms WHERE id = ? and status = 1', [req.params.id], (err, result) => {
        if (err) {
            console.log(err)
            resp.status(500).json({
                success: false,
                message: 'err',
            })
        }
        if (result.length > 0) {

            let url = "https://capnolearning.com/webroot/blank_forms/"
            let filename = result[0].forms;
            let pdf = ".pdf"

            const finalFileName = filename.replace(/ /g, "_");

            const finalfileUrl = url + finalFileName + pdf;

            console.log(finalfileUrl);
            // resp.status(200).json({
            //     success: true,
            //     data: result,
            // })

            setTimeout(async () => {


                const pdfDoc = await PDFDocument.create()

                const HelveticaBoldfont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
                const page2 = pdfDoc.addPage();

                const { width, height } = page2.getSize()

                const completeformPdfBytes = await fetch(finalfileUrl).then((res) => res.arrayBuffer());
                const [compleformpdf] = await pdfDoc.embedPdf(completeformPdfBytes);

                const completeformDims = compleformpdf.scale(1);


                page2.drawPage(compleformpdf, {
                    ...completeformDims,
                    x: page2.getWidth() / 1 - completeformDims.width / 1,
                    y: page2.getHeight() / 1 - completeformDims.height / 1,
                });







                fs.writeFileSync("./output.pdf", await pdfDoc.save())


                const data = fs.readFileSync('./output.pdf');
                resp.contentType("application/pdf");
                resp.send(data);







            }, 5000);

        }
    })

}



