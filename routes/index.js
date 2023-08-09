var express = require("express");
var router = express.Router();
var request = require("request");
var cors = require("cors");
require("dotenv").config();
var crypto = require("crypto");

router.get("/", async (req, res) => {
  res.json(
    "Welcome to AUT Blockchain & Cryptocurrency Technology 2023 S2 Tutorial"
  );
});

module.exports = router;
