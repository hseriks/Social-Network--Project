
const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/social"
);

module.exports.register = (first, last, email, password) => {
    const q =
        "INSERT INTO users (first, last, email, password) VALUES ($1,$2,$3,$4) RETURNING id";
    return db.query(q, [first, last, email, password]);
};

module.exports.hashedPsw = (email) => {
    const q = "SELECT password, id FROM users WHERE email = $1;";
    return db.query(q, [email]);
};

module.exports.emailCheck = (email) => {
    const q = "SELECT email FROM users WHERE email = $1";
    return db.query(q, [email]);
};      

module.exports.addCode = (code, email) => {
    const q =
        "INSERT INTO reset_codes (code, email) VALUES ($1,$2) RETURNING id";
    return db.query(q, [code, email]);
};

module.exports.getInfo = (id) => {
    const q = "SELECT bio, id, first, last, profile_pic_url FROM users WHERE id = $1";
    return db.query(q, [id]);
};

module.exports.addImage = (file, id) => {
    const q = "UPDATE users SET profile_pic_url = $1 WHERE id = $2 RETURNING profile_pic_url ";
    return db.query(q, ["https://pulse-today.s3.amazonaws.com/" + file, id]);

};

module.exports.checkCode = (code) => {
    const q = "SELECT * from reset_codes where code = $1 ";
    return db.query(q, [code]);

};

exports.resetPassword = (password, email) => {
    return db.query(`UPDATE users SET password=$1 WHERE email=$2`, [password, email]);
};

module.exports.addBio = (bio, id) => {
    const q = "UPDATE users SET bio=$1 WHERE id=$2 RETURNING bio";
    return db.query(q, [bio, id]);

};

module.exports.fetchUsers = () => {
    const q = " SELECT * FROM users ORDER BY id DESC LIMIT 3;";
    return db.query(q);

};

module.exports.fetchSearchedUsers = (val) => {
    const q = "SELECT * FROM users WHERE first ILIKE $1";
    return db.query(q, [val + '%']);
};


module.exports.checkFriends = (cookieId, paramsId) => {
    const q = "SELECT * FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1);";
    return db.query(q, [cookieId, paramsId]);
};

module.exports.friendRequest = (cookieId, paramsId) => {
    const q = "INSERT INTO friendships (sender_id, recipient_id) VALUES ($1, $2)";
    return db.query(q, [cookieId, paramsId]);
};

module.exports.acceptFriendRequest = (cookieId, paramsId) => {
    const q =
        "UPDATE friendships SET accepted=true where recipient_id = $1 AND sender_id = $2";
    return db.query(q, [cookieId, paramsId]);
};

module.exports.cancelFriendship = (cookieId, paramsId, accept) => {
    const q =
        "UPDATE friendships SET accepted=$3 where (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)";
    return db.query(q, [cookieId, paramsId, accept]);
};

module.exports.getPendingAndFriends = (resipientId) => {
    const q = "SELECT users.id, first, last, profile_pic_url, accepted FROM friendships JOIN users ON (accepted = false AND recipient_id = $1 AND sender_id = users.id) OR (accepted = true AND recipient_id = $1 AND sender_id = users.id) OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)";

    return db.query(q, [resipientId]);
};

module.exports.getChatMessages = () => {
    const q = "SELECT * FROM chat ORDER BY chat.created_at ASC LIMIT 10;";
    return db.query(q);
};

module.exports.getChatMessagesWJoin = () => {
    const q = "SELECT * FROM chat JOIN users ON sender_id = users.id ORDER BY chat.created_at DESC LIMIT 10;";
    return db.query(q);
};

module.exports.postChatMessage = (sender_id, chatText) => {
    const q =
        "INSERT INTO chat (sender_id, chatText) VALUES ($1, $2) RETURNING id, sender_id, chattext, created_at";
    return db.query(q, [sender_id, chatText]);
};

module.exports.getImageUrl = (userId) => {
    const q = "SELECT profile_pic_url FROM users where (id = $1)";
    return db.query(q, [userId]);
};





    
    
