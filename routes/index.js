var express = require("express");
var router = express.Router();
var db = require("../demo");
var details = require("../userDB");
const ExcelJs = require("exceljs");
const fs = require("fs");
const xlsx = require("xlsx");
router.get("/form", function (req, res, next) {
  res.render("index");
});
router.get("/createsheet", function (req, res, next) {
  res.send("sheet created");
});
router.post("/createsheet", function (req, res, next) {
  // let callSP = `CALL new_procedure`;
  // db.query(callSP, function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  //   let response = result[0];
  //   let workbook = xlsx.utils.book_new();

  //   let worksheet = xlsx.utils.json_to_sheet(response);
  //   xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //   xlsx.writeFile(
  //     workbook,
  //     "../sheets/test.xlsx" 
  //   );
  // });
  db.query("SELECT * FROM users", (error, results) => {
    // (C1) EXTRACT DATA FROM DATABASE
    if (error) throw error;
    var data = [];
    results.forEach((row) => {
      data.push([row["user_name"], row["user_email"]]);
    });
   
    // (C2) WRITE TO EXCEL FILE
    var worksheet = xlsx.utils.aoa_to_sheet(data),
        workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Users");
    xlsx.writeFile(workbook, "../sheets/test.xlsx");
  });
  res.send("Sheet Created");
});

router.get("/task", function (req, res, next) {
  db.query("SELECT * FROM users ORDER BY id desc", function (err, rows) {
    if (err) {
      console.log(err);
      //  res.render('userTask',{page_title:"Users - Node.js",data:''});
    } else {
      console.log(rows);
      res.render("userTask", { page_title: "Users - Node.js", data: rows });
    }
  });
  // res.render("userTask");
});
router.post("/task", function (req, res, next) {
  const userDetails = req.body;
  console.log(userDetails);
  // insert user data into users table
  var sql = "INSERT INTO details SET ?";
  db.query(sql, userDetails, function (err, data) {
    if (err) throw err;
    console.log("User data is inserted successfully ");
  });
  res.redirect("/task");
});

router.post("/create", function (req, res, next) {
  // store all the user input data
  const userDetails = req.body;

  // insert user data into users table
  var sql = "INSERT INTO users SET ?";
  db.query(sql, userDetails, function (err, data) {
    if (err) throw err;
    console.log("User data is inserted successfully ");
  });
  res.redirect("/form"); // redirect to user form page after inserting the data
});
module.exports = router;
