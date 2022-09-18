const md5 = require('md5');
const dbConn = require('../dbConnection')

 
var SavedSingleReport = function(report) {
    this.session_id = report.session_id
    this.pid = report.pid
    this.name = report.name
    this.notes = report.notes
    this.pdf	 = report.pdf	
    this.status	 = report.status	
    this.timezone	 = report.timezone	
    this.added_on = new Date()
}







// get all Client 
SavedSingleReport.getMultiReportDetail   = (data,result) => {
   
  dbConn.query('SELECT * , report_name as name FROM multisession_data_report WHERE   rid = ?    order by `id` desc', [data.id],  (err, res) => {
      if (err) {
        result(err ,null);  
      } else {
        result(null, res)
      }
    })


} 

// get all Client 
SavedSingleReport.getReportDetail   = (data,result) => {
   
  dbConn.query('SELECT * FROM client_session_report WHERE   id = ?    order by `id` desc', [data.id],  (err, res) => {
      if (err) {
        result(err ,null);  
      } else {
        result(null, res)
      }
    })


} 


// get all Client 
SavedSingleReport.getAllReport = (data,result) => {
   
        dbConn.query('SELECT * FROM client_session_report WHERE   session_id = ?    order by `id` desc', [data.session_id],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    
  
} 
 


SavedSingleReport.updateGroupGraph = (_data,result) => {

  let data = _data._config ; 

  let _other = {
            xrange: data.xrange, 
            units: data.units,
            annotation: data.annotation, 
            grid: data.grid,
            inverty: data.inverty,
            yposition: data.yposition,
            lineType: data.lineType,
            thresholdtLine: data.thresholdtLine,
            thresholdtcolor: data.thresholdtLine,
            stat: data.stat,
            thresholdthick: data.thresholdthick,
            thresholdvalue: data.thresholdvalue,
            clock: data.clock
  };
  _other = JSON.stringify(_other)
  let comment = JSON.stringify(data.comment);

  

 dbConn.query('UPDATE `client_session_report_graphs` set   `color` =? ,`type` = ?, `avg` =? , `thick` = ?, `xmin` = ?,`xextreme` = ?, `xmax` = ?, `ymin` = ?, `ymax` = ?, `graph_order` = ? ,`comment` = ?, `other_config` =  ? WHERE `clientSerial` = ? AND signal_name = ?  AND `rid` = ?  ' , [data.color,data.type,data.avg, data.thick,data.xmin,data.xextreme,data.xmax,data.ymin,data.ymax,data.graph_order,comment,_other,_data.clientSerial,data.signal,_data.reportId],  (err, res) => {
     if (err) {    
       result(err ,null);
     } else { 
       result(null, res)   
     }  
   }) 
} 




SavedSingleReport.updateGraph = (_data,result) => {

  let data = _data._config ; 

  let _other = {
            xrange: data.xrange, 
            units: data.units,
            annotation: data.annotation, 
            grid: data.grid,
            inverty: data.inverty,
            yposition: data.yposition,
            lineType: data.lineType,
            thresholdtLine: data.thresholdtLine,
            thresholdtcolor: data.thresholdtLine,
            stat: data.stat,
            thresholdthick: data.thresholdthick,
            thresholdvalue: data.thresholdvalue,
            clock: data.clock
  };
  _other = JSON.stringify(_other)
  let comment = JSON.stringify(data.comment);

  

 dbConn.query('UPDATE `client_session_report_graphs` set   `color` =? ,`type` = ?, `avg` =? , `thick` = ?, `xmin` = ?,`xextreme` = ?, `xmax` = ?, `ymin` = ?, `ymax` = ?, `graph_order` = ? ,`comment` = ?, `other_config` =  ? WHERE `signal_name` = ?  AND `rid` = ?  ' , [data.color,data.type,data.avg, data.thick,data.xmin,data.xextreme,data.xmax,data.ymin,data.ymax,data.graph_order,comment,_other,_data.signal_name,_data.reportId],  (err, res) => {
     if (err) {    
       result(err ,null);
     } else { 
       result(null, res)   
     }  
   }) 
} 




SavedSingleReport.saveGroupGraph = (_data,result) => {

  let data = _data._config ; 

  let _other = {
            xrange: data.xrange, 
            units: data.units,
            annotation: data.annotation, 
            grid: data.grid,
            inverty: data.inverty,
            yposition: data.yposition,
            lineType: data.lineType,
            thresholdtLine: data.thresholdtLine,
            thresholdtcolor: data.thresholdtLine,
            stat: data.stat,
            thresholdthick: data.thresholdthick,
            thresholdvalue: data.thresholdvalue,
            clock: data.clock
  };
  _other = JSON.stringify(_other)
  let comment = JSON.stringify(data.comment);
 
  

 dbConn.query('INSERT INTO `client_session_report_graphs` (`signal_name`,`color`,`type`, `avg`, `thick`, `xmin`,`xextreme`, `xmax`, `ymin`, `ymax`, `rid`, `graph_order`,`comment`, `row`, `col` , `other_config`,`clientSerial`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ' , [data.signal,data.color,data.type,data.avg, data.thick,data.xmin,data.xextreme,data.xmax,data.ymin,data.ymax,_data.reportId,data.graph_order,comment,data.row,data.col,_other,_data.serial],  (err, res) => {
     if (err) {    
       result(err ,null);
     } else {  
       result(null, res)   
     }  
   }) 
} 



SavedSingleReport.saveGraph = (_data,result) => {

  let data = _data._config ; 

  let _other = {
            xrange: data.xrange, 
            units: data.units,
            annotation: data.annotation, 
            grid: data.grid,
            inverty: data.inverty,
            yposition: data.yposition,
            lineType: data.lineType,
            thresholdtLine: data.thresholdtLine,
            thresholdtcolor: data.thresholdtLine,
            stat: data.stat,
            thresholdthick: data.thresholdthick,
            thresholdvalue: data.thresholdvalue,
            clock: data.clock
  };
  _other = JSON.stringify(_other)
  let comment = JSON.stringify(data.comment);

  

 dbConn.query('INSERT INTO `client_session_report_graphs` (`signal_name`,`color`,`type`, `avg`, `thick`, `xmin`,`xextreme`, `xmax`, `ymin`, `ymax`, `rid`, `graph_order`,`comment`, `row`, `col` , `other_config` ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ' , [_data.signal_name,data.color,data.type,data.avg, data.thick,data.xmin,data.xextreme,data.xmax,data.ymin,data.ymax,_data.reportId,data.graph_order,comment,data.row,data.col,_other],  (err, res) => {
     if (err) {    
       result(err ,null);
     } else { 
       result(null, res)   
     }  
   }) 
} 




// get all Client 
SavedSingleReport.updateReport = (data,result) => {
  //  console
  dbConn.query('UPDATE `client_session_report` SET  `notes` = ? , `timezone` = ? WHERE id = ? ', [data.notes, data.timezone,data.rid],  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })


} 

// get all Client 
SavedSingleReport.saveReport = (data,result) => {
  //  console
  dbConn.query('INSERT INTO `client_session_report`(`session_id`, `pid`, `name`, `notes`,`status`, `timezone`,`clock`) VALUES (?,?,?,?,?,?,?)', [data.session_id,data.pid,data.name,data.notes, data.status, data.timezone, data.clock],  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })


} 

// get all Client 
SavedSingleReport.getAllNotes = (data,result) => {
   
  dbConn.query('SELECT client_session_report.notes,client_session_report.name,client_session.name as sessiondate FROM client_session_report LEFT JOIN client_session ON client_session_report.session_id = client_session.id WHERE  session_id = ?  AND notes != "" ', [data.session_id],  (err, res) => {
      if (err) {
        result(err, err)
      } else { 
        result(null, res)
      }
    })


} 

module.exports = SavedSingleReport