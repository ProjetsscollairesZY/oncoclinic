import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import admRouter from './routes/admRout.js';
import docRouter from './routes/docRout.js';
import macRouter from './routes/macRout.js';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import patRouter from './routes/patRout.js';
import rdvRout from './routes/rdvRout.js';
import path from 'path';
import sadmRout from './routes/SadmRout.js';
const app = express();
const port = process.env.PORT || 4000;

// Connexions bdd et api
connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/admin', admRouter);
app.use('/api/sadmin', sadmRout);

app.use('/api/doctor', docRouter);
app.use('/api/machine', macRouter);
app.use('/api/patient', patRouter);
app.use('/api/rdv',rdvRout);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (req, res) => {
  res.send('Serveur lance');
});
