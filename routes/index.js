var express = require("express");
var router = express.Router();
// var moment = require("moment");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const helpers = require("../helpers/util");

module.exports = function (db) {
  router.get("/", (req, res, next) => {
    res.render("index/login", {info: req.flash("info") });
  });

  router.get("/register", (req, res, next) => {
    res.render("index/register", {info: req.flash("info") });
  });

  router.post("/", (req, res, next) => {
    db.query(
      "select * from admin where email = $1",
      [req.body.email],
      (err, row) => {
        
        if (err) {
          req.flash("info", "Salah nihh!");
          return res.redirect("/");
        }
        if (row.rows.length == 0) {
          console.log(row)
          req.flash("info", "email / password salah!");
         return res.redirect("/");
        }

        bcrypt.compare(
          req.body.password,
          row.rows[0].password,
          function (err, result) {
            if (result) {
              req.session.user = row.rows[0];
              
              res.redirect("/users");
            } else {
          console.log("tes",row)

              req.flash("info", "email / password salah!");
              res.redirect("/");
            }
          }
        );
       
      }
    );
  });

  
  router.get("/logout", function (req, res, next) {
    req.session.destroy(function (err) {
      res.redirect("/");
    });
  });

  
 
  return router;
};
