const Recording = require('../models/getRecordingModel')


// get all recoding distributor list
exports.getRecordingList = (req, res) => {
    Recording.getAllRecording((err, recordings) => {
        if(err)
        throw new Error(err)
        return res.status(200).json({ 
            success: true,
            recordings
        })
    })
}