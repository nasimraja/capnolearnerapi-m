const dbConn = require('../dbConnection')
const md5 = require('md5');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fetch = require("node-fetch");
const fs = require('fs');

exports.assemblylist = (req, resp) => {
    dbConn.query('SELECT * FROM assembly_report', (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
        if (result.length > 0) {
            resp.status(200).json({
                success: true,
                data: result
            })
        }
    })
}

exports.getAssemblylistbyid = (req, resp) => {
    dbConn.query('SELECT * FROM assembly_report WHERE id =?', [req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
        if (result.length > 0) {
            resp.status(200).json({
                success: true,
                data: result
            })
        }
    })
}

exports.assemblypdfreports = (req, resp) => {
    // console.log(req.params.session_id)
    dbConn.query('SELECT * FROM assembly_report WHERE session = ? and name IS NOT null ', [req.params.session_id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
        if (result.length > 0) {
            resp.status(200).json({
                success: true,
                data: result
            })
        }
        else{
            resp.status(404).json({
                success: false,
                message: 'Not FOund'
            })
        }
    })
}




exports.getclientformName = (req, resp) => {

    dbConn.query('SELECT client_form.form_name,client_form.cl_id,blank_forms.forms,blank_forms.id FROM client_form LEFT JOIN blank_forms ON client_form.form_name = blank_forms.id WHERE client_form.cl_id = md5(?)', [req.params.cl_id], (error, result) => {

        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
        if (result.length > 0) {
            resp.status(200).json({
                success: true,
                data: result
            })
        }

    })

}

exports.getpractionerformname = (req, resp) => {

    dbConn.query('SELECT practioner_form.sessid ,practioner_form.form_name,practioner_form.clientid,blank_forms.forms,blank_forms.id FROM practioner_form LEFT JOIN blank_forms ON practioner_form.form_name = blank_forms.id WHERE (practioner_form.clientid = ? and practioner_form.sessid  = ? ) || (practioner_form.clientid = ? and practioner_form.sessid  IS  null )', [req.params.clientid,req.params.sessionid,req.params.clientid], (error, result) => {

        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
        if (result.length > 0) {
            resp.status(200).json({
                success: true,
                data: result
            })
        }

    })

}



exports.saveAssemblyreport = (req, resp) => {

    var session = req.body.session;
    var lnotes = req.body.lnotes;
    var limages = req.body.limages;
    var rnotes = req.body.rnotes;
    var cforms = req.body.cforms;
    var reportids = req.body.reportids;
    let reportidsval = reportids.length > 0 ?  reportids.join() :  null;
    var forms = req.body.forms;
    let formsval = forms.join();
    // console.log(forms)

    var assemblydata = "INSERT INTO assembly_report (session,lnotes,limages,rnotes,cforms,reportids,forms) VALUES ?";

    var values = [
        [session, lnotes, limages, rnotes, cforms, reportidsval, formsval]
    ]


    dbConn.query(assemblydata, [values], function (error, result) {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }
        else {

            resp.status(200).json({
                success: true,
                message: 'Data save successfully',
                id: result.insertId,

            })
        }


    })

}

exports.updateAssemblyreport = (req, resp) => {

    var pdfrport = req.body.report_desc;
    let pdfrportjson = JSON.stringify(pdfrport)
    var livesessiionimg = req.body.session_image_desc;
    let livesessiionimgjson = JSON.stringify(livesessiionimg)

    const data = [req.body.name, req.body.summary, pdfrportjson, livesessiionimgjson, req.params.id];

    // console.log(req.body.name)
    // console.log(req.body.summary)
    // console.log(req.body.report_desc)
    // console.log(req.body.session_image_desc)
    dbConn.query('UPDATE assembly_report SET name =?,summary = ?,report_desc =?,session_image_desc =? WHERE id = ?', data, (err, result) => {
        if (err) {

            resp.status(500).json({
                success: false,
                message: 'DB error',
                error: err
            })
        } else {
            resp.status(200).json({
                success: true,
                message: 'Updated Successfully',

            })
        }
    })

}


exports.getassemblySetionReport = (req, resp) => {

    dbConn.query('SELECT * FROM assembly_report WHERE id =?', [req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }


        if (result[0]) {
            dbConn.query('SELECT * FROM session_data_report_pdf WHERE FIND_IN_SET (id, ?)', [result[0].reportids], (error, finalResult) => {
                if (error) {
                    resp.status(500).json({
                        success: false,
                        message: 'Something went wrong'
                    })
                }
                if (finalResult.length > 0) {
                    resp.status(200).json({
                        success: true,
                        data: finalResult,

                    })
                }
            })
        }
    })
}

exports.getassemblyReportsesseionNotes = (req, resp) => {

    dbConn.query('SELECT assembly_report.rnotes,assembly_report.id,client_session_report.notes FROM assembly_report LEFT JOIN client_session_report ON assembly_report.session = client_session_report.session_id WHERE assembly_report.id = ? and rnotes = 1 ', [req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
        if (result.length > 0) {
            resp.status(200).json({
                success: true,
                data: result
            })
        }
    })
}

// exports.getassemblyliveimages = (req, resp) =>{

// console.log(req.params.id)
// console.log(req.params.sessionid)

//     dbConn.query('SELECT assembly_report.limages,assembly_report.id,capno_data.sessiondata FROM assembly_report LEFT JOIN capno_data ON assembly_report.session = capno_data.sessionid WHERE assembly_report.id = ? and sessionid = md5(?) and limages = 1 and data_type = 3', [req.params.id,req.params.sessionid], (error, result) => {
//         if (error) {
//             resp.status(500).json({
//                 success: false,
//                 message: 'Something went wrong'
//             })
//         }
//         if(result.length > 0){
//             resp.status(200).json({
//                 success: true,
//                 data: result
//             })
//         }
//     })
// }

exports.getassemblyliveimages = (req, resp) => {


    console.log(req.params.id)
    dbConn.query('SELECT * FROM assembly_report WHERE id = ? and limages = 1', [req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }

        if (result[0]) {
            dbConn.query('SELECT * FROM capno_data WHERE sessionid = md5(?) and data_type = 3', [result[0].session], (error, finalResult) => {
                if (error) {
                    resp.status(500).json({
                        success: false,
                        message: 'Something went wrong'
                    })
                }
                if (finalResult.length > 0) {
                    resp.status(200).json({
                        success: true,
                        data: finalResult
                    })
                }
            })
        }
    })
}

exports.getassemblyliveNotes = (req, resp) => {

    dbConn.query('SELECT * FROM assembly_report WHERE id = ? and lnotes = 1', [req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
        if (result[0]) {
            dbConn.query('SELECT * FROM capno_data WHERE sessionid = md5(?) and data_type = 4', [result[0].session], (error, finalResult) => {
                if (error) {
                    resp.status(500).json({
                        success: false,
                        message: 'Something went wrong'
                    })
                }
                if (finalResult.length > 0) {
                    resp.status(200).json({
                        success: true,
                        data: finalResult
                    })
                }
            })
        }
    })
}

exports.getNmaes = (req, resp) => {


    console.log(req.params.id)
    dbConn.query('SELECT * FROM assembly_report WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
        // console.log(result[0].session)
        if (result[0]) {

            dbConn.query('SELECT * FROM client_session WHERE id = ?', [result[0].session], (err, resultCid) => {
                if (err) {
                    resp.status(500).json({
                        success: false,
                        message: 'Something went wrong'
                    })
                }
                // console.log(resultCid[0].cid)
                if (resultCid[0].cid) {
                    dbConn.query('SELECT * FROM capno_users WHERE md5(id) = ?', [resultCid[0].cid], (err, getclientResult) => {
                        if (err) {
                            resp.status(500).json({
                                success: false,
                                message: 'Something went wrong'
                            })
                        }
                        if (getclientResult[0].associated_practioner) {
                            dbConn.query('SELECT * FROM capno_users WHERE md5(id) = ?', [getclientResult[0].associated_practioner], (err, finalResult) => {

                                if (err) {
                                    resp.status(500).json({
                                        success: false,
                                        message: 'Somothing went wrong'
                                    })
                                }
                                if (finalResult.length > 0) {
                                    resp.status(200).json({
                                        success: true,
                                        data: finalResult,
                                        sessionDate: resultCid[0].name,
                                        firstname: getclientResult[0].firstname,
                                        lastname: getclientResult[0].lastname,

                                    })
                                }
                            })
                        }
                    })
                }


            })
        }


    })
}


// exports.getCompleteforms = (req, resp) => {

//     dbConn.query('SELECT * FROM assembly_report WHERE id =?', [req.params.id], (error, result) => {
//         if (error) {
//             resp.status(500).json({
//                 success: false,
//                 message: 'Something went wrong'
//             })
//         }
//         console.log(result[0].forms)
//         if (result[0].forms) {
//             dbConn.query('SELECT client_form.form_name,client_form.form,blank_forms.forms FROM client_form LEFT JOIN blank_forms ON client_form.form_name = blank_forms.type WHERE FIND_IN_SET (form_name, ?)', [result[0].forms], (error, resultFormName) => {
//                 if (error) {
//                     resp.status(500).json({
//                         success: false,
//                         message: 'Something went wrong'
//                     })
//                 }

//                 if(resultFormName.length > 0){


//                             resp.status(200).json({
//                                 success: true,
//                                 data: resultFormName,

//                             })

//                 }
//             })
//         }
//     })
// }

exports.getCompleteformsClient = (req, resp) => {

    dbConn.query('SELECT * FROM assembly_report WHERE id =?', [req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }

        if (result[0]) {
            console.log('SELECT client_form.form_name,client_form.form,blank_forms.forms FROM client_form LEFT JOIN blank_forms ON client_form.form_name = blank_forms.id WHERE FIND_IN_SET(client_form.form_name, "'+result[0].forms+'") and client_form.cl_id = md5('+req.params.cl_id+')');
            dbConn.query('SELECT client_form.form_name,client_form.form,blank_forms.forms FROM client_form LEFT JOIN blank_forms ON client_form.form_name = blank_forms.id WHERE FIND_IN_SET(client_form.form_name, ?) and client_form.cl_id = md5(?)', [result[0].forms, req.params.cl_id], (error, resultFormName) => {
                if (error) {
                    resp.status(500).json({
                        success: false,
                        message: 'Something went wrong'
                    })
                }

                if (resultFormName.length > 0) {

                    resp.status(200).json({
                        success: true,
                        data: resultFormName,

                    })

                }else{
                    resp.status(404).json({
                        success: true,
                        data:resultFormName,

                    })
                }
            })
        }
    })
}


exports.getCompleteformsTrainer = (req, resp) => {

    dbConn.query('SELECT * FROM assembly_report WHERE id =?', [req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }

        if (result[0]) {
            console.log('SELECT practioner_form.form_name,practioner_form.form,blank_forms.forms FROM practioner_form LEFT JOIN blank_forms ON practioner_form.form_name = blank_forms.id WHERE FIND_IN_SET(practioner_form.form_name, "'+result[0].forms+'") and practioner_form.clientid = '+req.params.cl_id+' ')
            dbConn.query('SELECT practioner_form.form_name,practioner_form.form,blank_forms.forms FROM practioner_form LEFT JOIN blank_forms ON practioner_form.form_name = blank_forms.id WHERE FIND_IN_SET(practioner_form.form_name, ?) and practioner_form.clientid = ?', [result[0].forms, req.params.cl_id], (error, resultFormName) => {
                if (error) {
                    resp.status(500).json({
                        success: false,
                        message: 'Something went wrong'
                    })
                }

                if (resultFormName.length > 0) {

                    resp.status(200).json({
                        success: true,
                        data: resultFormName,

                    })

                }
                else{
                    resp.status(404).json({
                        success: false,
                        data: [],

                    })
                }
            })
        }
    })
}


exports.saveAssemblyFullscreenshort = (req, resp) => {
    // var report_img = req.body.report_img;


    const data = [req.body.report_img, req.params.id];
    // console.log(req.body.report_img)

    // const doc = new jsPDF();

    // doc.addImage(req.body.report_img, 10, 15,200,115);

    // doc.save("a4.pdf");

    dbConn.query('UPDATE assembly_report SET report_img =? WHERE id = ?', data, (err, result) => {
        if (err) {

            resp.status(500).json({
                success: false,
                message: 'DB error',
                error: err
            })
        } else {
            resp.status(200).json({
                success: true,
                message: 'pdf save Successfully',

            })
        }
    })


}


exports.getFullscreenshort2 = (req, resp) => {
    let sessionDates = [];
    let ClientName = [];
    let trainerName = [];

    let summaryName = [];
    let summaryDes = [];
    let pdfArray = [];
    let pdfreportDescriptionArray = [];
    let liveSessionNoteArray = [];
    let liveSessionimgArray = [];
    let liveimgSessionDesArray = [];
    let reportNotesArray = [];
    let completeFormArray = [];
    let tcompleteFormArray = [];




    dbConn.query('SELECT * FROM assembly_report WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }

        if (result[0]) {

            dbConn.query('SELECT * FROM client_session WHERE id = ?', [result[0].session], (err, resultCid) => {
                if (err) {
                    resp.status(500).json({
                        success: false,
                        message: 'Something went wrong'
                    })
                }

                if (resultCid[0]) {
                    dbConn.query('SELECT * FROM capno_users WHERE md5(id) = ?', [resultCid[0].cid], (err, getclientResult) => {
                        if (err) {
                            resp.status(500).json({
                                success: false,
                                message: 'Something went wrong'
                            })
                        }
                        if (getclientResult[0].associated_practioner) {
                            dbConn.query('SELECT * FROM capno_users WHERE md5(id) = ?', [getclientResult[0].associated_practioner], (err, finalResult) => {

                                if (err) {
                                    resp.status(500).json({
                                        success: false,
                                        message: 'Somothing went wrong'
                                    })
                                }
                                if (finalResult.length > 0) {
                                    sessionDates.push(resultCid[0].name),
                                        ClientName.push(getclientResult[0].firstname + " " + getclientResult[0].lastname),
                                        trainerName.push(finalResult[0].firstname + " " + getclientResult[0].lastname)

                                    // resp.status(200).json({
                                    //     success: true,
                                    //     data: finalResult,


                                    // })
                                }
                            })
                        }
                    })
                }


            })
        }


    })
    dbConn.query('SELECT * FROM assembly_report WHERE id =?', [req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
        if (result.length > 0) {

            summaryName.push(result[0].name);
            summaryDes.push(result[0].summary);
            pdfreportDescriptionArray.push(JSON.parse(result[0].report_desc));
            liveimgSessionDesArray.push(JSON.parse(result[0].session_image_desc));
            // resp.status(200).json({
            //     success: true,
            //     data:result
            // })
        }

    })

    dbConn.query('SELECT * FROM assembly_report WHERE id =?', [req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }

        console.log(result[0].reportids)
        if (result[0].reportids) {
            dbConn.query('SELECT * FROM session_data_report_pdf WHERE FIND_IN_SET (id, ?)', [result[0].reportids], (error, finalResult) => {
                if (error) {
                    resp.status(500).json({
                        success: false,
                        message: 'Something went wrong'
                    })
                }
                if (finalResult.length > 0) {
                    pdfArray.push(finalResult)


                    // resp.status(200).json({
                    //     success: true,
                    //     data: finalResult,

                    // })
                }
            })
        }
    })

    dbConn.query('SELECT * FROM assembly_report WHERE id = ? and lnotes = 1', [req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
        if (result[0]) {
            dbConn.query('SELECT * FROM capno_data WHERE sessionid = md5(?) and data_type = 4', [result[0].session], (error, livesessionNoteResult) => {
                if (error) {
                    resp.status(500).json({
                        success: false,
                        message: 'Something went wrong'
                    })
                }
                if (livesessionNoteResult.length > 0) {
                    liveSessionNoteArray.push(livesessionNoteResult[0].sessiondata)
                    // resp.status(200).json({
                    //     success: true,
                    //     data: livesessionNoteResult
                    // })
                }
            })
        }
    })



    dbConn.query('SELECT * FROM assembly_report WHERE id = ? and limages = 1', [req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }

        if (result[0]) {
            dbConn.query('SELECT * FROM capno_data WHERE sessionid = md5(?) and data_type = 3', [result[0].session], (error, liveSessionimgResult) => {
                if (error) {
                    resp.status(500).json({
                        success: false,
                        message: 'Something went wrong'
                    })
                }
                if (liveSessionimgResult.length > 0) {

                    liveSessionimgArray.push(liveSessionimgResult)

                    // resp.status(200).json({
                    //     success: true,
                    //     data: liveSessionResult
                    // })
                }
            })
        }
    })


    dbConn.query('SELECT assembly_report.rnotes,assembly_report.id,client_session_report.notes FROM assembly_report LEFT JOIN client_session_report ON assembly_report.session = client_session_report.session_id WHERE assembly_report.id = ? and rnotes = 1 ', [req.params.id], (error, reportNotesResult) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
        if (reportNotesResult.length > 0) {
            reportNotesArray.push(reportNotesResult[0].notes)
            console.log(reportNotesResult[0].notes)
            // resp.status(200).json({
            //     success: true,
            //     data: reportNotesResult
            // })
        }
    })

    dbConn.query('SELECT * FROM assembly_report WHERE id =?', [req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }

        if (result[0]) {
            dbConn.query('SELECT client_form.form_name,client_form.form,blank_forms.forms FROM client_form LEFT JOIN blank_forms ON client_form.form_name = blank_forms.id WHERE FIND_IN_SET (client_form.form_name, ?) and client_form.cl_id = md5(?)', [result[0].forms, req.params.cl_id], (error, completeFormResult) => {
                if (error) {
                    resp.status(500).json({
                        success: false,
                        message: 'Something went wrong'
                    })
                }

                if (completeFormResult.length > 0) {
                    completeFormArray.push(completeFormResult);
                    // resp.status(200).json({
                    //     success: true,
                    //     data: completeFormResult,

                    // })

                }
            })
        }
    })


    
    dbConn.query('SELECT * FROM assembly_report WHERE id =?', [req.params.id], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }

        if (result[0]) {
            dbConn.query('SELECT practioner_form.form_name,practioner_form.form,blank_forms.forms FROM practioner_form LEFT JOIN blank_forms ON practioner_form.form_name = blank_forms.id WHERE FIND_IN_SET(practioner_form.form_name, ?) and practioner_form.clientid = ?', [result[0].forms, req.params.cl_id], (error, completeFormResult) => {
                if (error) {
                    resp.status(500).json({
                        success: false,
                        message: 'Something went wrong'
                    })
                }

                if (completeFormResult.length > 0) {
                    tcompleteFormArray.push(completeFormResult);
                    // resp.status(200).json({
                    //     success: true,
                    //     data: completeFormResult,

                    // })

                }
            })
        }
    })



    setTimeout(async () => {
        let flatsessionDates = sessionDates.flat();
        let stringsessionDates = flatsessionDates.toString();
        let flatClientName = ClientName.flat();
        let stringClientName = flatClientName.toString();
        let flattrainerName = trainerName.flat();
        let stringtrainerName = flattrainerName.toString();
        let stringsummaryName = summaryName.toString();
        let stringsummaryDes = summaryDes.toString();


        let flatpdfArray = pdfArray.flat();
        let flatpdfreportDestionArray = pdfreportDescriptionArray.flat();
        let flatliveSessionNoteArray = liveSessionNoteArray.flat();
        let liveSessionNote = flatliveSessionNoteArray.toString();
        let flatliveSessionimgArray = liveSessionimgArray.flat();
        let flatliveimgSessionDesArray = liveimgSessionDesArray.flat();
        let flatreportNotesArray = reportNotesArray.flat();
        let stringreportNotesArray = flatreportNotesArray.toString();
        let flatcompleteFormArray = completeFormArray.flat();
        let flattcompleteFormArray = tcompleteFormArray.flat();
        let pdfUrl = "https://capnolearning.com/webroot/client_forms/";
        let tpdfUrl = "https://capnolearning.com/webroot/practioner_forms/";



        // console.log(flatcompleteFormArray)

        const pdfDoc = await PDFDocument.create()

        const HelveticaBoldfont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
        const page3 = pdfDoc.addPage();

        let headingcapno = fs.readFileSync("./heading.png");

        headingcapno = await pdfDoc.embedPng(headingcapno)

        const headingcapnoimgbox = headingcapno.scale(0.6);

        page3.drawImage(headingcapno, {
            ...headingcapnoimgbox,
            x: page3.getWidth() / 2 - headingcapnoimgbox.width / 2,
            y: page3.getHeight() / 2 - headingcapnoimgbox.height / 2 + 400,
            left: 20


        });
        const { width, height } = page3.getSize()
        const summaryfontSize = 11

        page3.drawText('Client Name:', {
            x: 20,
            y: height - 6 * summaryfontSize,
            size: summaryfontSize,
            color: rgb(0, 0, 0),
            font: HelveticaBoldfont,

        })
        const summaryfontSize2 = 11
        page3.drawText(stringClientName, {
            x: 110,
            y: height - 6 * summaryfontSize2,
            size: summaryfontSize2,
            color: rgb(0, 0, 0),
        })

        page3.drawText('Trainer Name:', {
            x: 20,
            y: height - 8 * summaryfontSize,
            size: summaryfontSize,
            color: rgb(0, 0, 0),
            font: HelveticaBoldfont,
        })

        page3.drawText(stringtrainerName, {
            x: 110,
            y: height - 8 * summaryfontSize2,
            size: summaryfontSize2,
            color: rgb(0, 0, 0),
        })

        page3.drawText('Session Date:', {
            x: 20,
            y: height - 10 * summaryfontSize,
            size: summaryfontSize,
            color: rgb(0, 0, 0),
            font: HelveticaBoldfont,
        })

        page3.drawText(stringsessionDates, {
            x: 110,
            y: height - 10 * summaryfontSize2,
            size: summaryfontSize2,
            color: rgb(0, 0, 0),
        })
        const fontSizeSummary = 11
        page3.drawText('Report Name:', {
            x: 20,
            y: height - 16 * fontSizeSummary,
            size: fontSizeSummary,
            color: rgb(0, 0, 0),
            font: HelveticaBoldfont,
        })
        page3.drawText(stringsummaryName ? stringsummaryName : "No report name", {
            x: 120,
            y: height - 16 * fontSizeSummary,
            size: fontSizeSummary,
            color: rgb(0, 0, 0),
        })

        page3.drawText("Report Summary:", {
            x: 20,
            y: height - 18 * summaryfontSize,
            size: fontSizeSummary,
            color: rgb(0, 0, 0),
            font: HelveticaBoldfont,
        })

        page3.drawText(stringsummaryDes ? stringsummaryDes : "No report summary", {
            x: 120,
            y: height - 18 * summaryfontSize,
            size: fontSizeSummary,
            color: rgb(0, 0, 0),
        })



        var pdfArrayrequiredPages = flatpdfArray.length

        for (var i = 0; i < pdfArrayrequiredPages; i++) {
            const HelveticaBoldfont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

            const page1 = pdfDoc.addPage();

            const { width, height } = page1.getSize()

            let headingcapno = fs.readFileSync("./heading.png");

            headingcapno = await pdfDoc.embedPng(headingcapno)

            const headingcapnoimgbox = headingcapno.scale(0.6);

            page1.drawImage(headingcapno, {
                ...headingcapnoimgbox,
                x: page1.getWidth() / 2 - headingcapnoimgbox.width / 2,
                y: page1.getHeight() / 2 - headingcapnoimgbox.height / 2 + 400,
                left: 20


            });

            page1.drawText('Client Name:', {
                x: 20,
                y: height - 6 * summaryfontSize,
                size: summaryfontSize,
                color: rgb(0, 0, 0),
                font: HelveticaBoldfont,

            })
            const summaryfontSize2 = 11
            page1.drawText(stringClientName, {
                x: 110,
                y: height - 6 * summaryfontSize2,
                size: summaryfontSize2,
                color: rgb(0, 0, 0),
            })

            page1.drawText('Trainer Name:', {
                x: 20,
                y: height - 8 * summaryfontSize,
                size: summaryfontSize,
                color: rgb(0, 0, 0),
                font: HelveticaBoldfont,
            })

            page1.drawText(stringtrainerName, {
                x: 110,
                y: height - 8 * summaryfontSize2,
                size: summaryfontSize2,
                color: rgb(0, 0, 0),
            })

            page1.drawText('Session Date:', {
                x: 20,
                y: height - 10 * summaryfontSize,
                size: summaryfontSize,
                color: rgb(0, 0, 0),
                font: HelveticaBoldfont,
            })

            page1.drawText(stringsessionDates, {
                x: 110,
                y: height - 10 * summaryfontSize2,
                size: summaryfontSize2,
                color: rgb(0, 0, 0),
            })



            const fontSize = 12
            page1.drawText('PDF Report' + " " + "(" + (i + 1) + ")", {
                x: 20,
                y: height - 14 * fontSize,
                size: fontSize,
                color: rgb(0, 0, 0),
                font: HelveticaBoldfont,
            })

            let sessionimg = flatpdfArray[i].data;

            sessionimg = await pdfDoc.embedPng(sessionimg)

            const sessionimgBox = sessionimg.scale(0.3);

            page1.drawImage(sessionimg, {
                ...sessionimgBox,
                x: 0 ,
                y: page1.getHeight() / 2 - sessionimgBox.height / 2 + 100,
                width: width - 10



            });

            page1.drawText('PDF Report Description' + " " + "(" + (i + 1) + ")", {
                x: 20,
                y: height - 44 * fontSize,
                size: fontSize,
                font: HelveticaBoldfont,
                color: rgb(0, 0, 0),
            })
            const fontSizepdfArray = 12
            page1.drawText(flatpdfreportDestionArray[i] ? flatpdfreportDestionArray[i] : "No pdf report description ", {
                x: 20,
                y: height - 46 * fontSize,
                size: fontSizepdfArray,

                color: rgb(0, 0, 0),
            })

        }


        const page1 = pdfDoc.addPage();

        let headingcapno2 = fs.readFileSync("./heading.png");

        headingcapno2 = await pdfDoc.embedPng(headingcapno2)

        const headingcapnoimgbox2 = headingcapno2.scale(0.6);

        page1.drawImage(headingcapno, {
            ...headingcapnoimgbox2,
            x: page1.getWidth() / 2 - headingcapnoimgbox2.width / 2,
            y: page1.getHeight() / 2 - headingcapnoimgbox2.height / 2 + 400,
            left: 20


        });

        page1.drawText('Client Name:', {
            x: 20,
            y: height - 6 * summaryfontSize,
            size: summaryfontSize,
            color: rgb(0, 0, 0),
            font: HelveticaBoldfont,

        })
        const summaryfontSize3 = 11
        page1.drawText(stringClientName, {
            x: 110,
            y: height - 6 * summaryfontSize3,
            size: summaryfontSize3,
            color: rgb(0, 0, 0),
        })

        page1.drawText('Trainer Name:', {
            x: 20,
            y: height - 8 * summaryfontSize,
            size: summaryfontSize,
            color: rgb(0, 0, 0),
            font: HelveticaBoldfont,
        })

        page1.drawText(stringtrainerName, {
            x: 110,
            y: height - 8 * summaryfontSize2,
            size: summaryfontSize2,
            color: rgb(0, 0, 0),
        })

        page1.drawText('Session Date:', {
            x: 20,
            y: height - 10 * summaryfontSize,
            size: summaryfontSize,
            color: rgb(0, 0, 0),
            font: HelveticaBoldfont,
        })

        page1.drawText(stringsessionDates, {
            x: 110,
            y: height - 10 * summaryfontSize2,
            size: summaryfontSize2,
            color: rgb(0, 0, 0),
        })

        const fontSize = 12
        page1.drawText('Live Session Notes', {
            x: 20,
            y: height - 14 * fontSize,
            size: fontSize,
            color: rgb(0, 0, 0),
            font: HelveticaBoldfont,
        })
        const fontSizepdfArray = 12

        page1.drawText(liveSessionNote ? liveSessionNote : "No live session notes", {
            x: 20,
            y: height - 16 * fontSize,
            size: fontSizepdfArray,
            color: rgb(0, 0, 0),
        })

        var liveimgrequiredPages = flatliveSessionimgArray.length

        for (var i = 0; i < liveimgrequiredPages; i++) {
            const HelveticaBoldfont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
            const page1 = pdfDoc.addPage();

            const { width, height } = page1.getSize()


            let headingcapno = fs.readFileSync("./heading.png");

            headingcapno = await pdfDoc.embedPng(headingcapno)

            const headingcapnoimgbox = headingcapno.scale(0.6);

            page1.drawImage(headingcapno, {
                ...headingcapnoimgbox,
                x: page1.getWidth() / 2 - headingcapnoimgbox.width / 2,
                y: page1.getHeight() / 2 - headingcapnoimgbox.height / 2 + 400,
                left: 20


            });

            page1.drawText('Client Name:', {
                x: 20,
                y: height - 6 * summaryfontSize,
                size: summaryfontSize,
                color: rgb(0, 0, 0),
                font: HelveticaBoldfont,

            })
            const summaryfontSize2 = 11
            page1.drawText(stringClientName, {
                x: 110,
                y: height - 6 * summaryfontSize2,
                size: summaryfontSize2,
                color: rgb(0, 0, 0),
            })

            page1.drawText('Trainer Name:', {
                x: 20,
                y: height - 8 * summaryfontSize,
                size: summaryfontSize,
                color: rgb(0, 0, 0),
                font: HelveticaBoldfont,
            })

            page1.drawText(stringtrainerName, {
                x: 110,
                y: height - 8 * summaryfontSize2,
                size: summaryfontSize2,
                color: rgb(0, 0, 0),
            })

            page1.drawText('Session Date:', {
                x: 20,
                y: height - 10 * summaryfontSize,
                size: summaryfontSize,
                color: rgb(0, 0, 0),
                font: HelveticaBoldfont,
            })

            page1.drawText(stringsessionDates, {
                x: 110,
                y: height - 10 * summaryfontSize2,
                size: summaryfontSize2,
                color: rgb(0, 0, 0),
            })
            const fontSize = 12
            page1.drawText('Live Session Image' + " " + "(" + (i + 1) + ")", {
                x: 20,
                y: height - 12 * fontSize,
                size: fontSize,
                font: HelveticaBoldfont,
                color: rgb(0, 0, 0),
            })

            let liveimg = flatliveSessionimgArray[i].sessiondata;

            liveimg = await pdfDoc.embedPng(liveimg)

            const sessionimgBox = liveimg.scale(0.3);

            page1.drawImage(liveimg, {
                ...sessionimgBox,
                x: 0,
                y: page1.getHeight() / 2 - sessionimgBox.height / 2 + 100,
                width: width


            });

            page1.drawText('Live Session Image Description' + " " + "(" + (i + 1) + ")", {
                x: 20,
                y: height - 48 * fontSize,
                size: fontSize,
                font: HelveticaBoldfont,
                color: rgb(0, 0, 0),
            })
            const fontSizepdfArray = 12
            page1.drawText(flatliveimgSessionDesArray[i] ? flatliveimgSessionDesArray[i] : "No live session image description", {
                x: 20,
                y: height - 50 * fontSize,
                size: fontSizepdfArray,
                color: rgb(0, 0, 0),
            })




        }

        const page4 = pdfDoc.addPage();
        let headingcapno3 = fs.readFileSync("./heading.png");

            headingcapno3 = await pdfDoc.embedPng(headingcapno3)

            const headingcapnoimgbox3 = headingcapno3.scale(0.6);

            page4.drawImage(headingcapno3, {
                ...headingcapnoimgbox3,
                x: page4.getWidth() / 2 - headingcapnoimgbox3.width / 2,
                y: page4.getHeight() / 2 - headingcapnoimgbox3.height / 2 + 400,
                left: 20


            });

            page4.drawText('Client Name:', {
                x: 20,
                y: height - 6 * summaryfontSize,
                size: summaryfontSize,
                color: rgb(0, 0, 0),
                font: HelveticaBoldfont,

            })
            const summaryfontSize4 = 11
            page4.drawText(stringClientName, {
                x: 110,
                y: height - 6 * summaryfontSize4,
                size: summaryfontSize4,
                color: rgb(0, 0, 0),
            })

            page4.drawText('Trainer Name:', {
                x: 20,
                y: height - 8 * summaryfontSize,
                size: summaryfontSize,
                color: rgb(0, 0, 0),
                font: HelveticaBoldfont,
            })

            page4.drawText(stringtrainerName, {
                x: 110,
                y: height - 8 * summaryfontSize2,
                size: summaryfontSize2,
                color: rgb(0, 0, 0),
            })

            page4.drawText('Session Date:', {
                x: 20,
                y: height - 10 * summaryfontSize,
                size: summaryfontSize,
                color: rgb(0, 0, 0),
                font: HelveticaBoldfont,
            })

            page4.drawText(stringsessionDates, {
                x: 110,
                y: height - 10 * summaryfontSize2,
                size: summaryfontSize2,
                color: rgb(0, 0, 0),
            })

        const fontSizelivesessionNote = 12
        page4.drawText('Report Notes', {
            x: 20,
            y: height - 14 * fontSizelivesessionNote,
            size: fontSizelivesessionNote,
            color: rgb(0, 0, 0),
            font: HelveticaBoldfont,
        })
        const fontSizelivesessiondes = 12

        page4.drawText(stringreportNotesArray ? stringreportNotesArray : "No report notes", {
            x: 20,
            y: height - 16 * fontSizelivesessiondes,
            size: fontSizelivesessiondes,
            color: rgb(0, 0, 0),
        })

        var completeformrequiredPages = flatcompleteFormArray.length

        for (var i = 0; i < completeformrequiredPages; i++) {

            const HelveticaBoldfont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
            const page2 = pdfDoc.addPage();

            const { width, height } = page2.getSize()
            const fontSize = 12
            page2.drawText(flatcompleteFormArray[i].forms, {
                x: 20,
                y: height - 2 * fontSize,
                size: fontSize,
                font: HelveticaBoldfont,
                color: rgb(0, 0, 0),
            })
            const pdfUrls = pdfUrl + flatcompleteFormArray[i].form;
            // console.log(pdfUrls)
            const completeformPdfBytes = await fetch(pdfUrls).then((res) => res.arrayBuffer());
            const [compleformpdf] = await pdfDoc.embedPdf(completeformPdfBytes);

            const completeformDims = compleformpdf.scale(1);


            page2.drawPage(compleformpdf, {
                ...completeformDims,
                x: 20,
                y: page2.getHeight() / 1 - completeformDims.height / 1,
                width: width
            });

        }

        
        var tcompleteformrequiredPages = flattcompleteFormArray.length

        for (var i = 0; i < tcompleteformrequiredPages; i++) {

            const HelveticaBoldfont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
            const page2 = pdfDoc.addPage();

            const { width, height } = page2.getSize()
            const fontSize = 12
            page2.drawText(flattcompleteFormArray[i].forms, {
                x: 20,
                y: height - 2 * fontSize,
                size: fontSize,
                font: HelveticaBoldfont,
                color: rgb(0, 0, 0),
            })
            const pdfUrls = tpdfUrl + flattcompleteFormArray[i].form;
            // console.log(pdfUrls)
            const completeformPdfBytes = await fetch(pdfUrls).then((res) => res.arrayBuffer());
            const [compleformpdf] = await pdfDoc.embedPdf(completeformPdfBytes);

            const completeformDims = compleformpdf.scale(1);


            page2.drawPage(compleformpdf, {
                ...completeformDims,
                x: 30,
                y: page2.getHeight() / 1 - completeformDims.height / 1,
                width: width
            });

        }


        fs.writeFileSync("./output.pdf", await pdfDoc.save())


        const data = fs.readFileSync('./output.pdf');
        resp.contentType("application/pdf");
        resp.send(data);




        // let _resp = {
        //     success: true,
        //     sessionDates: sessionDates,
        //     ClientName: ClientName,
        //     trainerName: trainerName,
        //     summaryName: summaryName,
        //     summaryDes: summaryDes,
        //     pdfArray: pdfArray,
        //     pdfreportDescriptionArray: pdfreportDescriptionArray,
        //     liveSessionNoteArray: liveSessionNoteArray,
        //     liveSessionimgArray: liveSessionimgArray,
        //     liveimgSessionDesArray: liveimgSessionDesArray,
        //     reportNotesArray: reportNotesArray,
        //     completeFormArray: completeFormArray

        // }

        // return resp.status(200).json(_resp)


    }, 20000);

}


// session assembly reports api


exports.displayEssemblylist = (req, resp) => {
    dbConn.query('SELECT * FROM client_session WHERE id = ?', [req.params.id], (err, result) => {

        if (err) {
            console.log(err)
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }
        if (result[0]) {
            dbConn.query('SELECT * FROM capno_users WHERE md5(id) = ?', [result[0].cid], (err, getclientResult) => {
                if (err) {
                    console.log(err)
                    resp.status(500).json({
                        success: false,
                        message: 'Somothing went wrong'
                    })
                }
                if (getclientResult) {

                    // console.log(req.params.id)
                    dbConn.query('SELECT name,created_at,id FROM assembly_report WHERE session = ? and name IS NOT null and name != "" ', [req.params.id], (err, finalResult) => {

                        if (err) {
                            resp.status(500).json({
                                success: false,
                                message: 'Somothing went wrong'
                            })
                        }
                        if (finalResult.length > 0) {
                            resp.status(200).json({
                                success: true,
                                data: finalResult,
                                sessionDate: result[0].name,
                                firstname: getclientResult[0].firstname,
                                lastname: getclientResult[0].lastname,


                            })
                        }
                        else{
                            resp.status(404).json({

                            success: true,
                            data: [],
                            })
                        }
                    })
                }
            })
        }

    })

}

exports.DeletedisplayEssemblylist = (req, resp) => {
    dbConn.query('DELETE FROM assembly_report WHERE id = ?', [req.params.id], (err, result) => {

        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }
        resp.send(result)

    })
}