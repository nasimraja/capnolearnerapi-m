const md5 = require('md5');
const dbConn = require('../dbConnection')

 
var ConfiguredReportGraph = function(report) {
    this.name = report.name
    this.status = report.status
    this.original = report.original
    this.byuser = report.byuser
    this.type = report.type
    this.created_at = new Date()
    this.updated_at = new Date()
}

 




// get all Config 
ConfiguredReportGraph.getMultiReportGraph = (data,result) => {
 
  dbConn.query('SELECT * FROM client_multi_session_report_graphs WHERE    rid = ?   order by `graph_order` asc', [data.report_id],  (err, res) => {
    if (err) {
      result(err ,null);
    } else {
      result(null, res)
    }
  })
 }


// get all Config 
ConfiguredReportGraph.getAllReportGraph = (data,result) => {
 
      dbConn.query('SELECT * FROM client_session_report_graphs WHERE    rid = ?   order by `graph_order` asc', [data.report_id],  (err, res) => {
        if (err) {
          result(err ,null);
        } else {
          result(null, res)
        }
      })
     }
   
// get all Config 
ConfiguredReportGraph.getAllGraph = (data,result) => {
   
        dbConn.query('SELECT * FROM pre_configured_graphs WHERE    pid = ?   order by `graph_order` asc', [data.report_id],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    
  
} 
  


ConfiguredReportGraph.saveAlternateGraph = (_data,result) => {
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
  }
  _other = JSON.stringify(_other);
 dbConn.query('INSERT INTO `pre_configured_graphs` (`signal_name`,`color`,`type`, `avg`, `thick`, `xmin`, `xmax`, `ymin`, `ymax`, `pid`, `graph_order`, `row`, `col` , `other_config` ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ' , [_data.signal_name,data.color,data.type,data.avg, data.thick,data.xmin,data.xmax,data.ymin,data.ymax,_data.alternateId,data.graph_order,data.row,data.col,_other],  (err, res) => {
     if (err) {
       result(err ,null);
     } else { 
       result(null, res)   
     }  
   }) 
 
  
} 

   
module.exports = ConfiguredReportGraph