var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");
const saltRounds = 10;
const helpers = require("../helpers/util");
var moment = require("moment");
const { query } = require("express");
const { timeEnd } = require("console");

module.exports = function (db) {
  router.get("/",  function (req, res, next) {
    const session = req.session.user
    const { Name, Start, End } = req.query;

    const url = req.url == "/" ? "/users/?page=1" : `/users${req.url}`;

    const page = parseInt(req.query.page || 1);
    const limit = 200;
    const offset = (page - 1) * limit;

    let params = [];
    if (Name) {
      params.push(`worker."Name" ilike '%${Name}%'`);
    }

    if (Start) {
      params.push(`worker."Date" >= '${Start}'`);
    }

    if (End) {
      params.push(`worker."Date" <= '${End}'`);
    }

    let sqlcount = `select * from worker`;
    
    if (params.length > 0) {
      sqlcount += ` where ${params.join(" and ")}`;
    }
    console.log(sqlcount)
    
    
    db.query(sqlcount, (err, data) => {
      if (err) {
        return res.send(err);
      }

      const total = data.rows.length;
      const pages = Math.ceil(total / limit);
      let sql = `select * from worker`;

      db.query(sql, (err, memberss) => {
        if (err) throw err;

        let sql = `select * from worker`;
        if (params.length > 0) {
          sql += ` where ${params.join(" and ")}`;
        }
       
        sql += ` limit ${limit} offset ${offset}`;

        db.query(sql, (err, row) => {
          if (err) throw err;

          db.query(sql, (err, rows) => {
            if (err) throw err;

                res.render("users/users", {
                  nama: rows.rows,
                  namas: row.rows,
                  namass: data.rows,
                  query: req.query,
                  memberss: memberss.rows,
                  page,
                  pages,
                  url,
                  
                  session, moment
                });
             
          });
        });
      });
    });
  });

  


  return router;
};
