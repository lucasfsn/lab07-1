import { Router } from 'express';
import { ObjectId } from 'mongodb';
import db from '../utils/db.js';

export const recordRouter = Router();

recordRouter.get('/', async (req, res) => {
  await db.init();
  let db_connect = db.getClient();
  // console.log(db_connect);

  try {
    const result = await db_connect.collection('products').find({}).toArray();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// recordRouter.post('/', async (req, res) => {
//   const { name, price, description, quantity, unit } = req.body;
//   const db_connect = db.getDb();

//   try {
//     const uniqueName = await db_connect
//       .collection('products')
//       .findOne({ name });

//     if (existingProduct)
//       return res.status(400).json({ error: 'Product name must be unique' });

//     const result = await db_connect
//       .collection('products')
//       .insertOne({ name, price, description, quantity, unit });

//     res.json(result.ops[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// recordRouter.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name, price, description, quantity, unit } = req.body;
//   const db_connect = db.getDb();

//   try {
//     const result = await db_connect
//       .collection('products')
//       .updateOne(
//         { _id: new ObjectId(id) },
//         { $set: { name, price, description, quantity, unit } }
//       );

//     if (result.modifiedCount === 0) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     res.json({ message: 'Product updated successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// recordRouter.delete('/:id', async (req, res) => {
//   const { id } = req.params;
//   const db_connect = db.getDb();

//   try {
//     const result = await db_connect
//       .collection('products')
//       .deleteOne({ _id: new ObjectId(id) });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     res.json({ message: 'Product deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// recordRouter.get('/raport', async (req, res) => {
//   const db_connect = db.getDb();

//   try {
//     const pipeline = [
//       {
//         $group: {
//           _id: null,
//           totalProducts: { $sum: 1 },
//           totalQuantity: { $sum: '$quantity' },
//           totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
//         },
//       },
//     ];

//     const raport = await db_connect
//       .collection('products')
//       .aggregate(pipeline)
//       .toArray();

//     res.json(raport[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
