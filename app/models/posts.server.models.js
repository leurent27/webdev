const db = require("../../database"); //require the database

const addNewPost = (post, done) => {
    const sql = 'Insert Into Post (text, date_published, author_id) VALUES (?, ?, ?)';
    let values = [post.text, Date.now(),1];

    db.run(aql, values, function(err){
        if(err) return done(err);
        return done(null, this.last_ID);
    });


}


const getSinglePost = (post_id, done) => {
    const sql = 'SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, FROM posts post, users u WHERE post.post_id=? AND post.author_id = u.user_id';

    db.get(sql, [post_id], function(err, post_details){
        if(err) return done(err);
        if(!post_details) return done(404);

        const sql = 'SELECT u.user_id, u.first_name, u.last_name, u.username, FROM ussers u, likes 1 WHERE 1.post_id=? AND 1.user_id=u.user_id';
        const like = [];
        db.each(
            sql,
            [post_id],
            (err, row) =>{
                if(err) return done(err);

                likes.push({
                    user: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    username: row.username
                })
            },
            (err, num_rows) => {
                if(err) return done(err);

                return done(null, {
                    post:post_details.post_id,
                    timesamp: post_details.date_published,
                    text: post.details.text,
                    author: {
                        user_id: post.details.user_id,
                        first_name: post.details.first_name,
                        last_name: post.details.last_name,
                        username: post.detais.username
                    },
                    likes: likes
                })
            }
        )
    })

}

const updatePost = (post_id, done) => {
    const sql= 'UPDATE posts Set text=? WHERE post_id=? And author_id';
    db.run(sql, [new_text, post_id], (err)=> {
        return done(err);
    })
}

const getlike = function (post_id, done){
    db.get(
        'SELECT post_id, user_id FROM like WHERE post_id=?',
        [post_id],
        function(err, row){
            if (row && row.user_id){
                return done(null, row.user_id);
            }else{
                return done(err);
            }
        }
    );
    };

    const delete_post = (post_id, done) => {
        const sql = "DELETE FROM post WHERE post_id =?"
    
        db.run(sql, [post_id], (err) => {
            return done(err);
        })
            
            
        };

const like = (post_id, done) => {
    const query = 'INSERT INTO like (post_id,user_id) Values (?,?)';
    let values = [post_id];
    db.run (query, values, function (err, results){
        done(err);
    });

}

const remove_like = (post_id, done) => {
    let query= 'DELETE FROM like WHERE post_id=? and author_id=?';
    let values=[post_id];
    db.run(query, values, function (err, results){
        done(err);
    });
}

const removePost = (post_id, done) => {
    let query = 'DELETE FROM posts WHERE posts_id=? and author_id=?';
    let values = [post_id];
    db.run(query, values, function (err, results){
        done(err);
    })
}


module.exports = {
    addNewPost: addNewPost,
    getSinglePost: getSinglePost,
    getlike: getlike,
    like: like,
    remove_like: remove_like,
    updatePost: updatePost,
    removePost: removePost,
    delete_post: delete_post
};