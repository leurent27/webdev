//const addNewUser = (user, done) => {
  //  const salt = crypto.randomBytes(64);
    //const hash = getHash(user.password, salt);

    //const sql = 'INSERT INTO users (first_name, last_name, username, password, salt) VALUES (?,?,?,?,?)'
    //let values = [user.first_name, user.last_name, user.username, hash, salt.toString('hex')];

    //db.run(sq, values, function(err){
      //  if(err) return done(err)
    //});
//}
const db= require('../database');
const crypto= require('crypto');

const authenticateUser = (username, password, done) => {
    const sl = 'SELECT user_id, password, salt FROM users WHERE username=?'
    
    

    db.get (sql,[username], (err, row) => {
        if(err) return done(err)
        if(!row) return done(404)

        if(row.salt === null) row.salt ='';

        let salt = Buffer.from(row.salt, 'hex');

        if (row.password === getHash(password, salt)){
            return done(false, row.user_id);
        }else{
            console.log("Wrong password");
            return done(404)
        }
    })
}




const getHash = function(password, salt){
    return crypto.pdkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
};

const setToken = (id, done) => {
    let token = crypto.randomBytes(16).toString('hex');
    const sql = 'UPDATE users SET session_token=? WHERE user_id=?'

    db.run(sql, [token, id], (err)=> {
        return done(err, token)
    })
}

const removeToken = (token, done) => {
    const sql = 'UPDATE users SET session_token=null WHERE session_token=?'

    db.run(sql, [token], (err)=> {
        return done(err)
    })
}

module.exports = {
    getHash: getHash,
    authenticateUser: authenticateUser,
    setToken: setToken,
    removeToken: removeToken
}