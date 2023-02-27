const { timeStamp } = require("console");
const SHA256 = require("crypto-js/sha256");
const EventEmitter = require("events");

class BlockChain extends EventEmitter {
  constructor() {
    super();
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return {
      index: 0,
      timestamp: Date.now(),
      data: "Genesis Block",
      previousHash: "0",
      hash: this.calculateHash(0, Date.now(), "Genesis Block", 0),
    };
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  createBlock(data) {
    const previousBlock = this.getLatestBlock();
    const newIndex = previousBlock.index + 1;
    const newTimeStamp = Date.now();
    const newHash = this.calculateHash(
      newIndex,
      newTimeStamp,
      data,
      previousBlock.hash
    );
    const newBlock = {
      index: newIndex,
      timestamp: newTimeStamp,
      data: data,
      previousHash: previousBlock.hash,
      hash: newHash,
    };
    this.chain.push(newBlock);
    this.emit("newBlock", newBlock);
    return newBlock;
  }

  calculateHash(index, timestamp, data, previousHash) {
    return SHA256(index + timestamp + data + previousHash).toString;
  }

  updateBlocks(newBlocks) {
    const latestBlock = this.getLatestBlock();
    const newLatestBlock = newBlocks[newBlocks.length - 1];
    if (newLatestBlock.index > latestBlock.index) {
      if (latestBlock.hash === newLatestBlock.previousHash) {
        this.chain = newBlocks;
        this.emit("blockchainUpdated", this.chain);
      } else {
        this.emit("replaceChainError");
      }
    }
  }

  getBlocks() {
    return this.chain;
  }
}

module.exports = BlockChain;
