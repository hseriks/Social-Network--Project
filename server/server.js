const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const { hash, compare } = require("./bc");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const {sendEmail, upload} = require ("./ses");
const cryptoRandomString = require("crypto-random-string");
const { uploader } = require("./upload");
const secrets = require("./secrets.json");

////////////////
//socket///////
//////////////


const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});



////////////////
//middleware///
//////////////

app.use(express.json());
app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));

const cookieSessionMiddleware = cookieSession({
    secret: secrets.sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);

io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// old cookie session middleware

// app.use(
//     cookieSession({
//         secret: secrets.sessionSecret,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});


////////////
//routes///
//////////

app.get("/welcome", (req, res) => {
    console.log("req.session: ", req.session);
    if (req.session.userId) {
        // if user is logged in, redirect away
        res.redirect("/");
    } else {
        res.sendFile(path.join(__dirname, "..", "client", "index.html")); // here start.js will be started again
    }
});

//BELOW: add blocking routes for errors 

/////////////////
//reg & login///
///////////////

app.post("/registration", (req, res) => {
    console.log("req.session: ", req.session);
    hash(req.body.password).then((hashedPw) => {
        console.log("hashedPw in /register:", hashedPw);
        console.log("registration data:", req.body);
        db.register(
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPw
        )
            .then((results) => {
                console.log("results after reg:", results);
                req.session.userId = results.rows[0].id;
                console.log("session cookie", req.session.userId);
                res.json(results);
                
            })
            .catch((err) => {
                console.log("error adding user", err);
                if (err) {
                    return res.json({duplicateEmail: true});
                }
                res.json({error:true});
            })
            .catch((err) =>  
            
            {
                console.log("err in hash:", err);
                res.json({error:true});
            }
            );
    });

});

app.post("/login", (req, res) => {
    console.log("req.session: ", req.session);
    hash(req.body.password).then((hashedPw) => {

        console.log("hashed psw", hashedPw);

        db.hashedPsw(req.body.email).then((results) => {
            console.log("password sent back", results.rows[0].password);
            compare(req.body.password, results.rows[0].password)
                    
                .then((match) => {
                    console.log("match value from compare:", match);

                    if (match) {
                        console.log("check results:", results.rows[0]);
                        req.session.userId = results.rows[0].id;
                        console.log("cookie after login", req.session);
                        res.json({validUser: true});
                           
                    } else {
                        console.log("password missmatch");
                        return res.json({errorFalsePW: true});
                    }
                    
                
                }).catch((err) => console.log("err in compare:", err)).catch((err) => {
                    console.log("err in hash:", err);
                    res.redirect("/login");
                });
        });

    });

});

///////////////////
//password reset//
/////////////////

app.post("/resetpassword", (req, res) => {
    console.log(req.body.email);

    db.emailCheck(req.body.email).then((results)=> {
        
        const secretCode = cryptoRandomString({
            length: 6,
        });

        // console.log("results after reset password request", results);

        if (results.rows[0]) {
            console.log("email exists");
            
            db.addCode(secretCode, req.body.email);
            // also send the code here
            const email = "hsolbergeriksen@gmail.com";
            sendEmail(email,secretCode, "test to reset email password");
            console.log("email was sent");
        } else {
            console.log("email does not exists");
            // res.json({email: false});
        }

        res.json({sentEmail: true});

    }).catch((err)=> {
        console.log("email was not sent",err );
    });
});

app.post("/password/reset/verify", (req, res) => {
    console.log("reset button worked", req.body);

    db.checkCode(req.body.code).then((results)=>{
        console.log(results.rows[0]);
        console.log(req.body.password);

        if (results.rows[0].code) {
            hash(req.body.password).then((hashedPw)=>{
                db.resetPassword(hashedPw,req.body.email).then((results)=>{
                    console.log("password has been reset successfully:", results);
                    res.json({codeMatch: true});
                }).catch((err) => {
                    console.log("error in updating password", err);
                });
            }).catch((err)=> {
                console.log("error in hassing password", err );
            });

        }
    }).catch((err)=> {
        console.log("error in checking email", err );
        res.json(({codeFalse: true}));
    });
});



////////
//Bio//
//////


app.post("/user", (req,res) => {

    // console.log("session id", req.session.userId);

    db.getInfo(req.session.userId).then((results) => {
        // console.log("results", results);
        // console.log("data from user database on id:", results.rows[0]);
        res.json(results.rows[0]);
    });

});

////////////////
//Other users//
//////////////

app.post("/user/:id", (req,res) => {
    // console.log("req params id", req.params.id);

    db.getInfo(req.params.id).then((results) => {
        // console.log("results on other profile after db request", results);
        // console.log("data from user database on id:", results.rows[0]);
        res.json(results.rows[0]);
    });

});

///////////////////////
//Search other users//
/////////////////////

app.post("/users", (req,res) => {
    console.log("inside search other users");
    // console.log(req.body);
    // console.log(req.body.search);

    if (req.body.search != "") {

        db.fetchSearchedUsers(req.body.search).then((results)=>{
        // console.log("results after search specified", results);
            res.json(results.rows);

        });} else {

        db.fetchUsers().then((results)=> {
            // console.log("inside fetchUsers", results.rows.slice(0,3));
            res.json(results.rows.slice(0,3));

        });}
    
});

//////////////////////////
//Friend request button//
////////////////////////


app.get("/friendCheck/:id", (req,res) => {
    // console.log("inside friend req button", req.body);
    console.log("id logged in user", req.session.userId);
    console.log("id recipient", req.params.id);

    db.checkFriends(req.session.userId, req.params.id).then((results) => {
        // console.log("results", results);
        console.log("data from friends db:", results.rows);

        for (var i= 0; i<results.rows.length; i++) {
            
            if (results.rows[i].accepted) {
                console.log("accepted was found");
                return res.json("End friendship");
            } 
        }
        if (results.rows == 0) {
            res.json("Send friend request");
        }
        else if (results.rows[0].recipient_id == req.params.id) {
            res.json("Cancel friend request");
        }
        else if (results.rows[0].accepted) {
            console.log("accepted value exists");
            res.json("End friendship");
        }
        else {
            res.json("Accept friend request");
        }
    
    }).catch((err)=> {
        console.log("error in getting friend status", err);
    });

});

app.post("/buttonCheck/:id", (req, res) => {
    console.log("made it inside server after clicking button");
    
    // console.log("results after button pressed", req.body);
    console.log("id logged in user", req.session.userId);
    console.log("id recipient", req.params);
    
    if (req.body.text == "Send friend request") {
        db.friendRequest(req.session.userId, req.params.id)
            .then((results) => {
                res.json("Cancel friend request");
            })
            .catch((err) => {
                console.log("error in updating send friend request", err);
            });
    } else if (req.body.text == "Accept friend request") {
        let accept = "true";
        db.acceptFriendRequest(req.session.userId, req.params.id, accept)
            .then((results) => {
                console.log("Accept friend button was sent");
                res.json("End friendship");
            })
            .catch((err) => {
                console.log("error in updating accept friend request", err);
            });
    } else if (req.body.text == "End friendship") {
        let accept = "false";
        db.cancelFriendship(req.session.userId, req.params.id, accept)
            .then((results) => {
                console.log("End friendship was requested");
                res.json("Send friend request");
            })
            .catch((err) => {
                console.log("error in canceling friendship", err);
            });
    } else if (req.body.text == "Cancel friend request") {
        let accept = "false";
        db.cancelFriendshipRequest(req.session.userId, req.params.id, accept)
            .then((results) => {
                console.log("cancel friend request was requested");
                res.json("Send friend request");
            })
            .catch((err) => {
                console.log("error in canceling friendship request", err);
            });
    } 

});


//////////////////////////////
///delte and update friends///
//////////////////////////////

app.post("/endFriendship/:id", async (req,res) => {
    
    const loggedInUser = req.session.userId;
    const  recipientId = req.params.id;

    console.log("id logged in user", loggedInUser);
    console.log("id recipient", recipientId);

    try {
        await db.cancelFriendship(loggedInUser,recipientId);
        res.json(true);
    } catch (error) {
        console.log(error);
    }
});

app.post("/acceptFriendrequest/:id", async (req, res) => {
    
    const loggedInUser = req.session.userId;
    const recipientId = req.params.id;

    console.log("id logged in user", loggedInUser);
    console.log("id recipient", recipientId);

    try {
        await db.acceptFriendRequest(loggedInUser, recipientId);
        console.log("made it inside the acceptfriendrequest");
        res.json(true);
    } catch (error) {
        console.log(error);
    }
});



/////////////////////////////
//Show friends and pending//
///////////////////////////


app.get("/friends.json", (req, res) => {

    console.log("req session user id:", req.session.userId);
    console.log(req.session.userId);
    db.getPendingAndFriends(req.session.userId)
        .then((results) => {
            console.log("results after getting all friends and wannabes:", results.rows);

            // console.log("results after qr db for wannabes:", results);
           
            // for (var i= 0; i<results.rows.length; i++) {
            //     console.log("results after getting friends and wannabes",results.rows[i]
            //     );}

            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error ing getting freinds and wannabes", err);
        });
});

/////////////////////////
//profile pic uploader//
///////////////////////


app.post("/upload", uploader.single("file"), upload, (req,res) => {
    // console.log("req.session: ", req.session);
    // console.log("I made it inside image upload");
    // console.log(req.file);

    db.addImage(req.file.filename, req.session.userId).then((results) => {
        // console.log("image added to table", results);
        res.json(results.rows[0].profile_pic_url);
    }).catch((err) => {
        console.log("error in uploading:", err);
    });
});

/////////////////
//bio uploader//
///////////////

app.post("/uploadbio", (req,res) => {

    // console.log("I made it inside bio upload");
    // console.log("bio passed on:", req.body.bio);
    // console.log("session id:", req.session.userId);

    db.addBio(req.body.bio, req.session.userId).then((results) => {
        // console.log("bio added to table", results);
        res.json(results.rows[0].bio);
    }).catch((err)=> {
        console.log("error in bio", err);
    });
});

///////////
//logout//
/////////


app.post("/resetCookie", function (req,res){
    console.log("req.session before delete", req.session);
    req.session.userId = null;
    console.log("cookies reset done");
    console.log("req.session after delete", req.session);
    // res.redirect("/welcome");
    res.json(req.session);
});

//////////////////
//chat function//
////////////////

app.get("/chat.json", (req, res) => {
    db.getChatMessagesWJoin().then((results)=> {
        // console.log("results after getting chats", results.rows);
        res.json(results.rows);
    });

});

app.post("/chatMessageInsert", (req, res) => {
    console.log("message passed to server:", req.body.chat);
    console.log("message passed to server:", req.session.userId);

    db.postChatMessage(req.session.userId, req.body.chat).then((results) => {
        console.log("results after inserting message", results.rows);

        const user = results.rows[0].sender_id;
        console.log(user);

        db.getImageUrl(user).then((data) => {
        
            console.log("trying to get picture", data.rows[0].profile_pic_url);
            
            const picture = data.rows[0].profile_pic_url;

            io.emit("chatMessage", {...results.rows[0], profile_pic_url: picture});

        });


        // io.emit("chatMessage", {...results.rows[0], data.rows });
        // res.json(results.rows[0].chattext);
    });
});



app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});




// this is the connection event

io.on("connection",  (socket) => {
    //the object passed to the callbacl, repr. the network connection betweeen client and server.

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    socket.broadcast.emit("broadcast", "hello friends!");

    console.log(`socket with the id ${socket.id} is now connected`);
    console.log("user id logged in", socket.request.session.userId);
    // console.log(socket);
    
    // socket.on('disconnect', function() {
    //     console.log(`socket with the id ${socket.id} is now disconnected`);
    // });


    socket.on('chatMessage', function(data) {
        console.log(data);
    });

    socket.emit("test", "Welome. It is nice to see you");

});
 

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});