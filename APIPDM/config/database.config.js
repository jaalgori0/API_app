const Mongoose = require("mongoose");
const debug = require("debug")("app:database");

const dbhost = process.env.DBHOST || "localhost";
const dbport = process.env.PORT || "27017";
const dbname = process.env.DBNAME || "feed-uca";

const dburi = process.env.DBURI || `mongodb://${dbhost}:${dbport}/${dbname}`;

/*
 Connect to database method
 */

const connect = async () => {
  try {
    await Mongoose.connect(dburi);
    debug("Conection to database started");
  } catch (error) {
    console.error(error);
    debug("Cannot connect to database");
    process.exit(1);
  }
};

/*
 Desconnect to database method
 */

const disconnect = async () => {
  try {
    await Mongoose.disconnect();
    debug("connection to database end");
  } catch (error) {
    process.exit(1);
  }
};

module.exports = {
  connect,
  disconnect,
};
