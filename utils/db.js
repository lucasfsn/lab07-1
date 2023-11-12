import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
dotenv.config();

const client = new MongoClient(`${process.env.MONGO_URI}/stepik`);

const init = async () => {
  try {
    await client.connect();
    console.log('Connected');
  } catch (error) {
    console.log(error);
  }
};
const getClient = () => {
  return client;
};

export default {
  init,
  getClient,
};
// const client = new MongoClient(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// let _db;

// function connectToServer(callback) {
//   client.connect(function (err, db) {
//     if (db) {
//       _db = db.db('stepik');
//       console.log('Successfully connected to MongoDB');
//     }
//     return callback(err);
//   });
// }

// function getDb() {
//   return _db;
// }

// export default {
//   connectToServer,
//   getDb,
// };
