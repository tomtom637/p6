require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');
const sauceRoutes = require('./routes/sauce');

// HIDES CERTAIN INFORMATIONS IN THE RESPONSE HEADERS
app.use(helmet());

// CORS
const whitelist = ['http://localhost:8081', 'http://127.0.0.1:8081'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}
app.use(cors(corsOptions));

// BODY PARSER
app.use(express.json());

// CONNECTION TO MONGO
mongoose.connect(process.env.DB_PATH, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, err => {
  if(!err) {
    console.log('successfuly connected to mongodb');
    return;
  }
  console.log(err);
});

// PUBLIC IMG PATH
app.use('/images', express.static(path.join(__dirname, 'images')));

//ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/sauces', sauceRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'it seems you hit a wrong path...' });
});


app.listen(port, () => console.log(`server started on port ${port}`));