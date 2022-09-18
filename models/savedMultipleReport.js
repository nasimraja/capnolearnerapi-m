const md5 = require('md5');
const dbConn = require('../dbConnection')

 
var SavedMultipleReport = function(report) {
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

SavedMultipleReport.getReport = (data,result) => {
   
  dbConn.query('SELECT * FROM multisession_data_report WHERE   rid = ?    order by `id` desc', [data.rid],  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })


} 

SavedMultipleReport.createReport = (data,result) => {
   
  dbConn.query('INSERT INTO `multisession_data_report`(`clid`, `notes`, `report_name`, `rid`, `timezone` ,`clock`) VALUES (md5(?),?,?,?,?,?)', [data.cid,data.notes,data.name,data.rid,data.timezone,data.clock],  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })


} 



SavedMultipleReport.saveReport = (data,result) => {
   
  dbConn.query('UPDATE `multisession_data_report` set   `notes` = ?, `report_name` = ?, `timezone` = ? where `rid` = ? ', [data.notes,data.name,data.timezone,data.rid],  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })


} 



// get all Client 

SavedMultipleReport.getAllReport = (data,result) => {
   
        dbConn.query('SELECT * , report_name as name FROM multisession_data_report WHERE   clid = ?    order by `id` desc', [md5(data.client_id)],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    
  
} 
 


SavedMultipleReport.saveGraph = (_data,result) => {

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
            thresholdvalue: data.thresholdvalue
  };
  _other = JSON.stringify(_other)
  let comment = JSON.stringify(data.comment);

  

 dbConn.query('UPDATE `client_multi_session_report_graphs` set   `color` =? ,`type` = ?, `avg` =? , `thick` = ?, `xmin` = ?,`xextreme` = ?, `xmax` = ?, `ymin` = ?, `ymax` = ? ,`comment` = ?, `other_config` =  ? WHERE `signal_name` = ? and `sid` = ?  AND `rid` = ?  ' , [data.color,data.type,data.avg, data.thick,data.xmin,data.xextreme,data.xmax,data.ymin,data.ymax,comment,_other,data.signal,_data.sid , _data.reportId],  (err, res) => {
     if (err) {    
       result(err ,null);
     } else { 
       result(null, res)   
     }  
   }) 
} 




// get all Client 
SavedMultipleReport.createGraph = (arraydata,result) => {
  // console.log(arraydata);
  let signal = arraydata[0] ; 
  let row = arraydata[1] ;
  let col = arraydata[2] ;
  let rid = arraydata[3] ;
  let sid = arraydata[4] ;
  let graph_order = arraydata[5] ;

  dbConn.query('SELECT * FROM pre_configured_graphs WHERE   signal_name = ?    order by `id` asc', [signal],  (err, resData) => {
    if (err) {
      result(err ,null);
    } else {
      if(resData[0]){
        let data =  resData[0]
        dbConn.query('INSERT INTO `client_multi_session_report_graphs`( `signal_name`, `color`, `type`, `avg`, `thick`, `xmin`, `xmax`, `ymin`, `ymax`, `rid`, `sid`, `graph_order`, `comment`, `row`, `col` ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)' , [signal,data.color,data.type,data.avg, data.thick,data.xmin,data.xmax,data.ymin,data.ymax,rid,sid,graph_order,null,row,col],  (err, res) => {
          if (err) {
            result(err ,null);
          } else {
            result(null, res)
          }
        })
      }
    }
  })



} 



module.exports = SavedMultipleReport