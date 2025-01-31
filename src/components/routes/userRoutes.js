const express=require('express');
const router=express.Router();
const User = require('../models/User');

router.post('/uploadPhoto',async (req,res)=>{
  const {user_email,photo}=req.body;

  if(!user_email||!photo) {
    return res.status(400).json({ message: 'User email and photo are required.' })
  }

  try{
    const user=await User.findOneAndUpdate(
      {user_email},
      {photo},
      {new:true,upsert:true}

    );
    console.log('FOUND IT ! ');
    res.status(200).json(user);
  }
  catch(err) {
      console.error('Error uploading photo:');
      res.status(500).json({ message: 'Internal server error.' });
  
  }

});

router.get('/getPhoto/:email',async(req,res)=>{
  const {email}=req.params;
  try{
    const user=await User.findOne({
      user_email:email
    })

    if(!user||!user.photo) {
      return res.status(404).json({ message: 'Photo not found.' });
    }
    return res.status(200).json({ photo: user.photo });
  }
  catch(err) {
    console.error('Error retrieving photo:');
    res.status(500).json({ message: 'Internal server error.' });
  }
})

router.get('/removePhoto/:email',async(req,res)=>{
  const {email}=req.params;

  try {
    // Use MongoDB's `$unset` operator to remove the `photo` field
    const user = await User.updateOne(
      { user_email: email }, // Match the user by email
      { $unset: { photo: "" } } // Remove the `photo` field
    );

    if (user.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' }); // No user found with this email
    }
    return res.status(200).json({ message: 'Photo removed successfully' });
}
  catch(err) {
    console.error('Error removing photo:');
    res.status(500).json({ message: 'Internal server error' });
  }
}
);

module.exports = router;

