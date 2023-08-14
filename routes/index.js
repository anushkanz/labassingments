var express = require("express");
var router = express.Router();
var request = require("request");
var cors = require("cors");
require("dotenv").config();
var crypto = require("crypto");
const bitcoin = require("bitcoinjs-lib");
const { ECPair } = require("ecpair");
const ecc = require("tiny-secp256k1");
const { MerkleTree } = require("crypto-js");
const gnuplot = require("gnuplot");
const fs = require("fs");

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
  //Task one
  class BlockchainGenerate {
    constructor() {
      this.chain = [this.createGenesisBlock()];
      this.difficulty = 4;
    }

    createGenesisBlock() {
      return new BlockGererate(0, "Genesis Block", "0");
    }

    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
      newBlock.previousHash = this.getLatestBlock().hash;
      newBlock.mineBlock(this.difficulty);
      this.chain.push(newBlock);
    }

    isChainValid() {
      for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i - 1];

        if (currentBlock.hash !== currentBlock.calculateHash()) {
          return false;
        }

        if (currentBlock.previousHash !== previousBlock.hash) {
          return false;
        }
      }

      return true;
    }
  }

  class BlockGererate {
    constructor(timestamp, data, previousHash = "") {
      this.timestamp = timestamp;
      this.data = data;
      this.previousHash = previousHash;
      this.hash = this.calculateHash();
      this.nonce = 0;
    }

    calculateHash() {
      return crypto
        .createHash("sha256")
        .update(
          this.previousHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce
        )
        .digest("hex");
    }

    mineBlock(difficulty) {
      while (
        this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
      ) {
        this.nonce++;
        this.hash = this.calculateHash();
      }

      console.log("Block mined:", this.hash);
    }
  }

  const blockchain = new BlockchainGenerate();

  console.log("Mining block 1...");
  blockchain.addBlock(new BlockGererate(Date.now(), { amount: 10 }));

  console.log("Mining block 2...");
  blockchain.addBlock(new BlockGererate(Date.now(), { amount: 25 }));

  //Task Two
  function generateNewBlock() {
    const blockchain = new BlockchainGenerate();
    const newIndex = blockchain.chain.length;
    const newTimestamp = Date.now();
    const newData = `Block ${newIndex}`;
    const newBlock = new BlockGererate(newIndex, newTimestamp, newData);
    blockchain.addBlock(newBlock);
  }

  // Automate block production every 5 seconds
  //setInterval(generateNewBlock, 5000);

  //Task three

  const transactionHashes = [
    "cbca99f1076b374613f01d50ba02dd7499164d6be6490f927201507dfe58ae86",
    "e08d95b1ac66d7638f759619f9007165576b5303f084eccca749cb755eb3f0ef",
    "3471bbb4c442d93b83d3a4671b95dc5edce3e100a79514592ee914991f6b329f",
    "dcd93fad31fdc724549bc10d87201a6eac819d9e8745f9e391aaf156f5d55dd7",
    // ... add more
  ];
  function calculateMerkleRootGenerate(transactionHashes) {
    if (transactionHashes.length === 0) {
      return null;
    }

    while (transactionHashes.length > 1) {
      const newLevel = [];
      for (let i = 0; i < transactionHashes.length; i += 2) {
        const left = transactionHashes[i];
        const right =
          i + 1 < transactionHashes.length ? transactionHashes[i + 1] : left;
        const combined = left < right ? left + right : right + left;

        const hash = crypto.createHash("sha256").update(combined).digest("hex");
        newLevel.push(hash);
      }
      transactionHashes = newLevel;
    }

    return transactionHashes[0];
  }
  const merkleRoot = calculateMerkleRootGenerate(transactionHashes);
  console.log("Merkle Root:", merkleRoot);

  //Task four
  const startBlockReward = 50;
  const haveInterval = 210000;
  const totalBlocks = 21000000; // Total blocks in the Bitcoin network

  function calculateBitcoinSupply(blockHeight) {
    const halvings = Math.floor(blockHeight / haveInterval);
    const supply = startBlockReward * (haveInterval / 2);
    return supply * Math.pow(0.5, halvings);
  }

  function generateSupplyData() {
    const data = [];
    for (
      let blockHeight = 0;
      blockHeight <= totalBlocks;
      blockHeight += haveInterval
    ) {
      const supply = calculateBitcoinSupply(blockHeight);
      data.push({ blockHeight, supply });
    }
    return data;
  }

  const supplyData = generateSupplyData();

  console.log("Block Height\t\tBitcoin Supply");
  console.log("--------------------------------------------");
  supplyData.forEach((entry) => {
    console.log(`${entry.blockHeight}\t\t${entry.supply.toFixed(8)}`);
  });
});
//Some code use resource from internet, nodes library from npm website

router.get("/week3", async (req, res) => {
  try {
    //Create public and Private key
    let keys = crypto.generateKeyPair(
      "ec",
      {
        namedCurve: "secp256k1",
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
          cipher: "aes-256-cbc",
          passphrase: "we attack at dawn",
        },
      },
      (err, publicKey, privateKey) => {
        //Create Bitcoin address
        const pubKey =
          "04d0988bfa799f7d7ef9ab3de97ef481cd0f75d2367ad456607647edde665d6f6fbdd594388756a7beaf73b4822bc22d36e9bda7db82df2b8b623673eefc0b7495";
        //const pubKey = convertTo64Hex(publicKey.toString("hex"));
        const { address } = bitcoin.payments.p2pkh({
          pubkey: new Buffer.from(pubKey, "hex"),
        });

        console.log(address);
        res.json({
          public: publicKey.toString("hex"),
          private: privateKey.toString("hex"),
          bitcoinAddress: address,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});
module.exports = router;
