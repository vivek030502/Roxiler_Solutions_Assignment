// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://vivektiwari4397:Vivek%40123@cluster0.vgbi6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the schema and model for transactions
const transactionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  dateOfSale: Date,
  sold: Boolean,
  category: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Fetch data from API and seed the database
app.get('/api/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    // Clear the collection and insert new seed data
    await Transaction.deleteMany();
    await Transaction.insertMany(transactions);

    res.status(200).send({ message: 'Database initialized with seed data' });
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).send({ message: 'Error seeding data', error });
  }
});

// List transactions API with pagination and search
app.get('/api/transactions', async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;

  const filter = month ? { dateOfSale: { $regex: new RegExp(`-${month.padStart(2, '0')}-`) } } : {};
  const searchFilter = search
    ? {
        $or: [
          { title: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { price: parseFloat(search) || 0 },
        ],
      }
    : {};

  try {
    const transactions = await Transaction.find({ ...filter, ...searchFilter })
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    const total = await Transaction.countDocuments({ ...filter, ...searchFilter });

    res.status(200).send({ transactions, total });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send({ message: 'Error fetching transactions', error });
  }
});

// Statistics API
app.get('/api/statistics', async (req, res) => {
  const { month } = req.query;
  const filter = month ? { dateOfSale: { $regex: new RegExp(`-${month.padStart(2, '0')}-`) } } : {};

  try {
    const totalSaleAmount = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    const totalSoldItems = await Transaction.countDocuments({ ...filter, sold: true });
    const totalNotSoldItems = await Transaction.countDocuments({ ...filter, sold: false });

    res.status(200).send({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).send({ message: 'Error fetching statistics', error });
  }
});

// Bar chart API for price ranges
app.get('/api/bar-chart', async (req, res) => {
  const { month } = req.query;
  const filter = month ? { dateOfSale: { $regex: new RegExp(`-${month.padStart(2, '0')}-`) } } : {};

  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity },
  ];

  try {
    const result = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({
          ...filter,
          price: { $gte: min, $lt: max === Infinity ? Number.MAX_SAFE_INTEGER : max },
        });
        return { range, count };
      })
    );

    res.status(200).send(result);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).send({ message: 'Error fetching bar chart data', error });
  }
});

// Pie chart API for categories
app.get('/api/pie-chart', async (req, res) => {
  const { month } = req.query;
  const filter = month ? { dateOfSale: { $regex: new RegExp(`-${month.padStart(2, '0')}-`) } } : {};

  try {
    const result = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.status(200).send(result);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).send({ message: 'Error fetching pie chart data', error });
  }
});

// Combined API to fetch all data
app.get('/api/combined', async (req, res) => {
  const { month } = req.query;

  try {
    const { page = 1, perPage = 10, search = '' } = req.query;
    const filter = month ? { dateOfSale: { $regex: new RegExp(`-${month.padStart(2, '0')}-`) } } : {};
    const searchFilter = search
      ? {
          $or: [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { price: parseFloat(search) || 0 },
          ],
        }
      : {};

    const transactions = await Transaction.find({ ...filter, ...searchFilter })
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));
    const total = await Transaction.countDocuments({ ...filter, ...searchFilter });

    const totalSaleAmount = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    const totalSoldItems = await Transaction.countDocuments({ ...filter, sold: true });
    const totalNotSoldItems = await Transaction.countDocuments({ ...filter, sold: false });

    const statistics = {
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems,
    };

    const priceRanges = [
      { range: '0-100', min: 0, max: 100 },
      { range: '101-200', min: 101, max: 200 },
      { range: '201-300', min: 201, max: 300 },
      { range: '301-400', min: 301, max: 400 },
      { range: '401-500', min: 401, max: 500 },
      { range: '501-600', min: 501, max: 600 },
      { range: '601-700', min: 601, max: 700 },
      { range: '701-800', min: 701, max: 800 },
      { range: '801-900', min: 801, max: 900 },
      { range: '901-above', min: 901, max: Infinity },
    ];

    const barChart = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({
          ...filter,
          price: { $gte: min, $lt: max === Infinity ? Number.MAX_SAFE_INTEGER : max },
        });
        return { range, count };
      })
    );

    const pieChart = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.status(200).send({
      transactions,
      total,
      statistics,
      barChart,
      pieChart,
    });
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).send({ message: 'Error fetching combined data', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
