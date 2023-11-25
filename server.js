const express = require('express');
const cors = require('cors');
const { connectToDb, getDb } = require('./db');
const ObjectId = require('mongodb').ObjectId;

const app = express();

app.use(cors());
app.use(express.json());

let db;
connectToDb(err => {
  if (!err) {
    app.listen(process.env.PORT, () => {
      console.log('Listening on port 3001');
    });
  }
  db = getDb();
});

app.get('/products/:operation?/:field?/:value?', async (req, res) => {
  try {
    const col = await db.collection('products');

    const { operation, field, value } = req.params;

    if (!operation || !field || !value)
      return res.json(await col.find().toArray());

    let filter = {};
    let sort = {};

    if (operation === 'filter') {
      filter[field] = value;
    } else {
      sort[field] = value === 'desc' ? -1 : 1;
    }

    const result = await col.find(filter).sort(sort).toArray();
    res.json(result);
  } catch (err) {
    console.error(err);
  }
});

app.post('/products', async (req, res) => {
  try {
    const col = await db.collection('products');

    const exist = await col.findOne({ name: req.body.name });
    if (exist)
      return res.status(400).json({ message: 'Product already exists.' });

    await col.insertOne(req.body);

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

    if (deleted.deletedCount === 1)
      return res.json({ message: 'Product has been deleted.' });

    return res.status(400).json({ message: 'Failed to delete product.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Found an error.' });
  }
});

app.get('/report/:name', async (req, res) => {
  try {
    const col = await db.collection('products');
    const { name } = req.params;

    const exist = await col.findOne({ name: name });
    if (!exist) return res.status(400).json({ message: 'Product not found.' });

    const result = await col
      .aggregate([
        {
          $match: { name: name },
        },
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
