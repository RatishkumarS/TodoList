//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");
// const router=express.Router();


const app = express();

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://ratishkumar1119:password-1@cluster0.0ugv9q0.mongodb.net/TodolistDB");


const TodoSchema=new mongoose.Schema({
  Title:String
});

const Layout=mongoose.model("Layout",TodoSchema);

const input1=new Layout({
  Title:" Welcome to your TodoList "
});
const input2=new Layout({
  Title:"+ Click here to add to the list"
});
const input3=new Layout({
  Title:"<-- Click here to delete from the list"
});

var inputList=[input1,input2,input3];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function(req, res) {

const day = date.getDate();

Layout.find({}).then((data)=>{
       console.log(data);
       if(data.length===0)
       {
         Layout.insertMany(inputList).then((err,data)=>{
           if(err)
             console.log(err);
           else {
             console.log("Layout inserted successfully");
           }
         });
       }
       res.render("list", {listTitle: day, newListItems: data});
    }).catch((err)=>{
      console.log(err);
    });
    //res.render("list", {listTitle: "Today", newListItems: data});
});


app.post("/", function(req, res){

   inputList.push(req.body.newItem);

   const inputPost=new Layout({
     Title:req.body.newItem
   });

   inputPost.save();

   res.redirect("/");

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete",function(req,res){
  const { checkbox } = req.body
    console.log(checkbox);
  Layout.deleteOne({Title:checkbox}).then((data)=>{
    console.log("Deleted "+data);
  });
  res.redirect("/")
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

// app.use("/.netlify/functions/api",router);
// module.exports.handler=serverless(app);
// "test": "echo \"Error: no test specified\" && exit 1"

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
