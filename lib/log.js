const dotenv = require("dotenv");
dotenv.config();

const DEBUG = process.env.DEBUG || true;

const log = (...msg) => (DEBUG ? console.log(...msg) : null);

module.exports = { log, DEBUG };
