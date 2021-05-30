const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
const fs = require('fs');
const imgModel = require('./model');
const multer = require('multer');
require('dotenv').config();

app.use(multer({dest:__dirname+'/uploads/'}).any());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function createSchool(client, newSchool) {
  const result = await client.db("schools").collection("school_info").insertOne(newSchool);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

app.get("/", async (req, res) => {
  const uri = process.env.DATABASE_URI;
  try {
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });
    imgModel.find({}, (err, items) =>{
      if (err) {
        console.log(err);
      } else {
        res.render("home", {
          schools: items
        });
      }
    });
  } catch (e) {
    console.error(e)
  }
});

app.get("/school", async (req, res) => {
  const uri = process.env.DATABASE_URI;
  try {
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });
    imgModel.findOne({
      name_field: req.query.name
    }, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        res.render("school", {
          school: item
        });
      }
    });
  } catch (e) {
    console.error(e)
  }
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/submit", async (req, res) => {
  const uri = process.env.DATABASE_URI;
  try {
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });
    const obj = {
      name_field: req.body.name_field,
      about_field: req.body.about_field,
      location_field: req.body.location_field,
      admissions_field: req.body.admissions_field,
      img: {
        data: fs.readFileSync(req.files[0].path),
        contentType: 'image/png'
      }
    };
    await imgModel.create(obj, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        item.save();
      }
    })
  } catch (e) {
    console.error(e)
  }
  await sleep(7000);
  return res.redirect("/");
});

app.get("/update", async (req, res) => {
  const uri = process.env.DATABASE_URI;
  try {
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });
    imgModel.findOne({
      name_field: req.query.name
    }, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        res.render("update", {
          school: item
        });
      }
    });
  } catch (e) {
    console.error(e)
  }
});

app.post("/submitUpdate", async (req, res) => {
  const uri = process.env.DATABASE_URI;
  try {
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });
    await imgModel.findOne(
      { name_field: req.body.name }, (err, item) => {
        item.name_field = req.body.name_field;
        item.about_field = req.body.about_field;
        item.location_field = req.body.location_field;
        item.admissions_field = req.body.admissions_field;
        item.img.data = fs.readFileSync(req.files[0].path);
        item.save();
      });
  } catch (e) {
    console.error(e);
  }
  await sleep(7000);
  return res.redirect("/");
});

app.listen(3000);
