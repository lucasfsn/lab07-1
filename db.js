const { MongoClient } = require('mongodb');
require('dotenv').config();

let dbConnection;

exports.connectToDb = async cb => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI);

    dbConnection = client.db();

    return cb();
  } catch (error) {
    console.log(error);

    return cb(error);
  }
};

exports.getDb = () => dbConnection;
