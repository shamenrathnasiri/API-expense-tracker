const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

const router = express.Router();

// Add transaction
router.post('/', auth, async (req, res) => {
  const { amount, type, note } = req.body;
  const transaction = await prisma.transaction.create({
    data: {
      amount,
      type,
      note,
      userId: req.user.userId,
    },
  });
  res.json(transaction);
});

// Get all
router.get('/', auth, async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(transactions);
});

// Get balance
router.get('/balance', auth, async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: req.user.userId },
  });

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  res.json({ income, expense, balance: income - expense });
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  await prisma.transaction.delete({
    where: { id: parseInt(req.params.id) },
  });
  res.json({ message: 'Deleted' });
});

module.exports = router;

