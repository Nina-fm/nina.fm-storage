const DEBUG = process.env.DEBUG || false;

const log = (...msg) => (DEBUG ? console.log(...msg) : null);

module.exports = { log, DEBUG };
