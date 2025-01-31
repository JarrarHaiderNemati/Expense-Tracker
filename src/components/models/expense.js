const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  name: { type: String, default: 'Unnamed Expense' },
  category: { type: String, default: 'General' },
  amount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
