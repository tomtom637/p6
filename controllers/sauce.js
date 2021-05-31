const Sauce = require('../models/sauce');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// GET ALL SAUCES
exports.getAllSauces = async (req, res) => {
  try {
    const sauces = await Sauce.find();
    res.status(200).json(sauces);
  } catch (err) {
    res.status(400).json({ error: err });
  }  
}

// GET A SAUCE
exports.getSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    res.status(200).json(sauce);
  } catch (err) {
    res.status(404).json({ error: err });
  }
}

// ADD A SAUCE
exports.addSauce = async (req, res) => {
  req.body.sauce = JSON.parse(req.body.sauce);
  const url = req.protocol + '://' + req.get('host');
  const sauce = new Sauce({
    userId: req.body.sauce.userId,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    mainPepper: req.body.sauce.mainPepper,
    imageUrl: url + '/images/' + req.file.filename,
    heat: req.body.sauce.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  try {
    await sauce.save();
    res.status(201).json({ message: 'Sauce added successfully!' });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

// UPDATE A SAUCE
exports.updateSauce = async (req, res) => {
  let sauce = new Sauce({ _id: req.params.id });
  if(req.file) {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    sauce = {
      _id: req.params.id,
      userId: req.body.sauce.userId,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: url + '/images/' + req.file.filename,
      heat: req.body.sauce.heat
    };
    const theSauce = await Sauce.findOne({ _id: req.params.id });
    const filename = theSauce.imageUrl.split('/images/')[1];
    fs.unlink('images/' + filename, () => true);    
  } else {
    sauce = {
      _id: req.params.id,
      userId: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      heat: req.body.heat
    };
  }
  try {
    await Sauce.updateOne({_id: req.params.id}, sauce);
    res.status(201).json({ message: 'Sauce updated successfully!' });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

// DELETE A SAUCE
exports.deleteSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink('images/' + filename, async () => {
      await Sauce.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Deleted!' });
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

// LIKE A SAUCE
exports.likeSauce = async (req, res) => {
  let sauce = new Sauce({ _id: req.params.id });
  const initialSauce = await Sauce.findOne({ _id: req.params.id });
  
  sauce = {
    _id: initialSauce._id,
    userId: initialSauce.userId,
    name: initialSauce.name,
    manufacturer: initialSauce.manufacturer,
    description: initialSauce.description,
    mainPepper: initialSauce.mainPepper,
    imageUrl: initialSauce.imageUrl,
    heat: initialSauce.heat,
    usersLiked: initialSauce.usersLiked,
    usersDisliked: initialSauce.usersDisliked,
    likes: 0
  };

  switch(req.body.like) {
    case -1:
      if(initialSauce.usersDisliked.includes(req.body.userId)) return;
      sauce.usersDisliked.push(req.body.userId);
      break;
    case 0:
      if(initialSauce.usersLiked.includes(req.body.userId)) {
        sauce.usersLiked.pull(req.body.userId);
      }
      if(initialSauce.usersDisliked.includes(req.body.userId)) {
        sauce.usersDisliked.pull(req.body.userId);
      }
      break;
    case 1:
      if(initialSauce.usersLiked.includes(req.body.userId)) return;
      sauce.usersLiked.push(req.body.userId);
      break;
  }
  sauce.likes = sauce.usersLiked.length;
  sauce.dislikes = sauce.usersDisliked.length;

  try {
    await Sauce.updateOne({_id: req.params.id}, sauce);
    res.status(201).json({ message: 'Sauce updated successfully!' });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}
