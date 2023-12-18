const express = require('express');
const cors = require('cors');
const { connectToDb, getDb } = require('./db');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

let db;
connectToDb(err => {
  if (!err) {
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });
  }
  db = getDb();
});

app.get('/products', async (req, res) => {
  try {
    const col = await db.collection('products');

    const filterFields = req.query.filterFields
      ? req.query.filterFields.split(',')
      : [];
    const filterValues = req.query.filterValues
      ? req.query.filterValues.split(',')
      : [];
    const sortFields = req.query.sortFields
      ? req.query.sortFields.split(',')
      : [];
    const sortDirections = req.query.sortDirections
      ? req.query.sortDirections.split(',')
      : [];

    let filter = {};
    filterFields.forEach((field, index) => {
      const value = filterValues[index];
      filter[field] = isNaN(value) ? value : Number(value);
    });

    let sort = {};
    sortFields.forEach((field, index) => {
      sort[field] = sortDirections[index] === 'desc' ? -1 : 1;
    });

    const result = await col.find(filter).sort(sort).toArray();
    res.json(result);
  } catch (err) {
    console.error(err);
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, price, description, quantity, unit } = req.body;

    const col = await db.collection('products');

    const exist = await col.findOne({ name: name });
    if (exist)
      return res.status(400).json({ message: 'Product already exists.' });

    await col.insertOne({ name, price, description, quantity, unit });

    res.json({ message: 'Product has been added.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Found an error.' });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const col = await db.collection('products');
    const { id } = req.params;

    const exist = await col.findOne({ _id: new ObjectId(id) });
    if (!exist) return res.status(400).json({ message: 'Product not found.' });

    await col.updateOne({ _id: new ObjectId(id) }, { $set: { ...req.body } });

    res.json({ message: 'Product has been updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Found an error.' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const col = await db.collection('products');
    const { id } = req.params;

    const exist = await col.findOne({ _id: new ObjectId(id) });
    if (!exist) return res.status(400).json({ message: 'Product not found.' });

    const deleted = await col.deleteOne({ _id: new ObjectId(id) });
    if (deleted.deletedCount === 0)
      return res.status(400).json({ message: 'Failed to delete the product.' });

    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Found an error.' });
  }
});

app.get('/report', async (req, res) => {
  try {
    const col = await db.collection('products');

    const result = await col
      .aggregate([
        {
          $group: {
            _id: '$name',
            totalQuantity: { $sum: '$quantity' },
            totalPrice: { $sum: { $multiply: ['$quantity', '$price'] } },
          },
        },
      ])
      .toArray();

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Found an error.' });
  }
});
