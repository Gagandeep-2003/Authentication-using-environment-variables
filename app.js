//jshint esversion:6
import 'dotenv/config'
import express from "express"
import bodyParser from "body-parser"
import ejs from "ejs"
import mongoose from "mongoose"
import encrypt from "mongoose-encryption"  //it encrypt when you call the save() and decrypt when you call the find().

const app = express();
const port = 3000;

console.log(process.env.SECRET);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{
    useNewUrlParser: true,
})

const userschema = new mongoose.Schema({
    email: String,
    password: String
});


userschema.plugin(encrypt, { secret: process.env.SECRET+ "." , encryptedFields: ['password']}); //make it before making the mongoose model

const User = new mongoose.model("User", userschema);

app.get("/", (req,res) =>{
    res.render("home");
})

app.get("/login", (req,res) =>{
    res.render("login");
})

app.get("/register", (req,res) =>{
    res.render("register");
})

app.post("/register", (req,res) =>{
   const newUser = new User({
        email: req.body.username,
        password: req.body.password,
    });
    newUser.save()
    .then(() => {
        res.render("secrets.ejs");
    })
    .catch(err => {
        console.log(err);
    });
    });


    app.post("/login", (req,res) =>{
             const username = req.body.username;
             const password = req.body.password;

             User.findOne({email: username})
             .then(founduser=>{
                if (founduser.password === password) {
                    res.render("secrets");
                }else{
                    console.log("Not a valid user");
                }
             }).catch(err=>{
                console.log(err);
             })

         });


app.listen( port, ()=>{
    console.log(`Listening on the port ${port}`);
})