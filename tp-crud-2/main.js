require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();

const port = process.env.PORT;

// connection to the database
// mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// const db = mongoose.connection;

// db.on("error", function (error) {
//     console.log(error);
// });

// db.once("open", function () {
//     console.log("Connected to the database");
// });

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false
    })
);

app.use( function(request, response, next){
    response.locals.message = request.session.message;
    delete request.session.message;
    next();
});

app.use(express.static("uploads")); 

// set template engine
app.set("view engine", "ejs");

// route prefix
app.use("", require("./routes/routes"));

app.listen(port, function () {
    console.log("Server started at http://localhost:" + port);
}); 