const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const app=express();
const PORT=5000;

app.use(express.json({ limit: '10mb' }));
app.use(cors());

const userRoutes = require('./routes/userRoutes');
mongoose
  .connect('mongodb://localhost:27017/expense', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

  const User = require('./models/User');
  const Expense = require('./models/expense');
  
app.post('/putData',async (req,res)=>{
  const {name,category,amount,user_email}=req.body;

  if(!name||!category||!amount||!user_email) {
    return res.status(500).send('Plz fill out all forms ! ');
  }

  try{
  const newExpense=new Expense({name,category,amount,user_email});
  await newExpense.save();
  return res.status(200).send('Data inserted successfully!');
  }
  catch(error) {
    console.error('Error inserting in mongo db ! ');
    return res.status(500).send('Some error occured while inserting ! ');
  }
  });

app.get('/getExpenses',async (req,res)=>{
  console.log('Baackrnd reached ! ');

  try{
    const getExp=await Expense.find();
    return res.status(200).json(getExp);
  }
  catch(err) {
    console.error('Error encountered fetching from mongo DB ! ');
    return res.status(500).json({message:'Errororroro ! '});
  }

});

app.post('/loginForm',async (req,res)=>{
  const {email,pass}=req.body;

  try {
    const user= await User.findOne({user_email:email,password:pass});
    if(!user) {
      console.log('No such user exists');
      return res.status(404).send('User not found ! ');
    }
    return res.status(200).send('Login successful!');
  }
  catch(err) {
    console.error('Some error occured while login');
    return res.status(500).send('Mongo error probably ! ');
  }
});

app.post("/signupForm", async (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res.status(400).send("Fill all forms!");
  }

  
  try{
    const existingUser = await User.findOne({ user_email: email });
    if (existingUser) {
      return res.status(400).send("User already exists!");
    }
    const newUser=new User({user_email:email,password:pass});
    await newUser.save();
    return res.status(200).send('Signup successful ! ');
  }
  catch(err) {
    console.error('Error of signup');
    return res.status(500).send('Error of signup ! ');
  }

});

app.get('/lastWeekExpenses',async (req,res)=>{

  const oneWeek=new Date();
  oneWeek.setDate(oneWeek.getDate()-7);

  try{
    const expenses=await Expense.find({
      createdAt:{$gte:oneWeek}
    })

    if(expenses.length>0) {
      console.log('found ! ');
       return res.status(200).json(expenses);
    }
    console.log('nothing found ! ');
    return res.status(200).json([]);
  }
  catch(err) {
    console.log('Error fetching expenses');
    return res.status(400).json({message:'Some error!'})
  }
});

app.get('/searchQuery',async (req,res)=>{
  const {name}=req.query;
  if (!name) {
    return res.status(400).json({ message: 'Search term is required!' });
  }
  try{
    const expenses=await Expense.find({
      name: { $regex: `^${name}`, $options: "i" }
  });
  if(expenses.length>0) {
  return res.status(200).json(expenses);
  }
  else {
    return res.status(200).json([]);
  }
  }
  catch(err) {
    return res.status(500).json({message:'Error occured ! '});
  }
});

app.use('/user', userRoutes);
app.post('/deleteExp',async (req,res)=>{
  const {name}=req.body;
  if(!name) {
    return res.status(404).json({message:'Please provide name of the expense first ! '});
  }

  const user=await Expense.deleteOne({
    name:name
  });

  if(user.deletedCount===0) {
    return res.status(400).json({message:'No such expense exists'});
  }
  return res.status(200).json(user);

}); 
app.listen(PORT,()=>{
  console.log('Server started ! ');
})