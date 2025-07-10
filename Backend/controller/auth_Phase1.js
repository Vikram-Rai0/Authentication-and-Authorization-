import express from 'express'
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';

const authRoutes = express.Router();

authRoutes.use(cookieParser());

// setCookie
authRoutes.get('/', function (req, res) {
    res.cookie("name", "Vikram");
    res.send('Done');
});

//readCookie
authRoutes.get('/read', function (req, res) {
    console.log(req.cookies);
    res.send("read Page")
})

// bcrypt password

authRoutes.get("/hash", function (req, res) {
    bcrypt.genSalt(10, function (err, salt) {
        //password encryption
        // console.log(salt); // salt is used to create a random String
        bcrypt.hash("hellohello123", salt, function (err, hash) { //bcrypt hashing my hellohello123 passwrod ->{$2b$10$Rsvsyds6vfptc6ox7izpGuGPnG3sMWRFniG5gwcSmrYLNU20HuxuO}
            console.log(hash);
        })
        // password decryption
        bcrypt.compare("hellohello123", "$2b$10$Rsvsyds6vfptc6ox7izpGuGPnG3sMWRFniG5gwcSmrYLNU20HuxuO", function (err, result) { //comparing weather the password matched with the hashed string or not 
            console.log(result);
        })
    })
})


//JWT (Json Web Token)

authRoutes.get("/jwt", function (req, res) {
    let token = jwt.sign({ email: "vikram002@gmail.com" }, "secret"); // convert email into secret key string
    res.cookie("token", token); //pass secret token as cookie
    res.send("done");

})

authRoutes.get("/readjwt", function (req, res) {
    console.log(req.cookies.token);
    let data = jwt.verify(req.cookies.token, "secret"); //decrypt the data
    console.log(data);
})
export default authRoutes;

