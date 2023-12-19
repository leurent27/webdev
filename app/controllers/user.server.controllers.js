const users = require('../models/user.server.models');
const Joi = require('joi');
const config = require('../../config/config');

const register = (req, res) =>{
    const schema = Joi.object({
        first_name: Joistring().required(),
        last_name: Joistring().required(),
        username: Joistring().required(),
        password: Joistring().required(),
    });

    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user1 = Object.assign({}, req.body);
    users.insert(user1, function(err,user_id){
        if (err){
            return res.status(400).send("Could not register a user, the username as been taken!")
        }else{
            return res.status(201).send({user_id: user_id});
        }
    })
}

const login = (req, res) =>{
    let username = req.body.username;
    let password = req.body.password;

    users.authenticate(username, password, function(err, id){
        if(err){
            res.status(400).json({error_message:'Invalid username/password given'});
        }else{
            users.getToken(id, function(err, token){
                if(token){
                    return res.status({user_id: id, session_token: token});
                }else{
                    users.setToken(id, function(err, token){
                        res.send({user_id: id, session_token: token});
                    });
                }
            });
        }
    });
}

const logout = (req, res) =>{
    let token =req.get('X-Authorization');
    users.removeToken(token, function(err){
        if (err){
            return res.sendStatus(401);
        }else{
            return res.sendStatus(200);
        }
    });
    return null;
}
module.exports ={
    register: register,
    login: login,
    logout: logout
};