const conn = require('../dbConnection').promise();

exports.getUser = async (req,res,next) => {
    try{
        const [row] = await conn.execute(
            "SELECT * FROM `capno_users` WHERE user_type = 1"
        );
        if(row.length > 0){
            return res.json({
                user:row
            });
        }
        res.json({
            message:"No user found"
        });
    }
    catch(err){
        next(err);
    }
}