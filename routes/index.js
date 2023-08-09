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
router.get("/week2", async (req, res) => {
  /*
   * Block One
   */
  let chain = { transactions: [], merkleRoot: [] };
  let block = {
    height: 1,
    time: 0,
    prevHash: "this is the genesis block",
    merkleRoot: "",
    transactions: [],
  };

  let transaction = "Pay $1,000,000 to Jeff";
  let hash = crypto.createHash("sha256");
  hash.update(transaction);
  let hashed_tx = hash.digest("hex");
  block.transactions.push(hashed_tx);
  block.merkleRoot = hashed_tx;

  /*
   * Block Two
   */
  let block2 = {
    height: 2,
    time: 1,
    prevHash: "null",
    merkleRoot: "null",
    transactions: [],
  };

  let transaction2 = "Alice +10";
  let hash2 = crypto.createHash("sha256");
  hash2.update(transaction2);
  let hashed_tx2 = hash2.digest("hex");
  block2.transactions.push(hashed_tx2);
  block2.merkleRoot = hashed_tx2;

  /*
   * Block One to hash
   */
  let hash3 = crypto.createHash("sha256");
  hash3.update(JSON.stringify(block));
  let hash_genesis = hash3.digest("hex");
  block2.prevHash = hash_genesis;

  // change the dollar sign to a negative sign in the original transaction
  let new_transaction = "Pay -1,000,000 to Jeff";
  let hash4 = crypto.createHash("sha256");
  hash4.update(new_transaction);
  let hashed_tx4 = hash4.digest("hex");
  block2.transactions.push(hashed_tx4);

  try {
    if (block2.prevHash != hash_genesis) {
      console.log("Your chain has been attacked!!");
    }
    res.json({
      blocl2: block2,
    });
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

module.exports = router;
