import express from 'express';
import { addDocteur, allDoctors, adminProfile,loginAdmin, deleteDoctor, allPatients } from '../controllers/adminCtrl.js';
import { changeAvailability } from '../controllers/docteurCtrl.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authadmin.js';

const admRout = express.Router();

admRout.post('/add-docteur', authAdmin, upload.single('photo'), addDocteur);
admRout.post('/login', loginAdmin);
admRout.get('/all-doctors', authAdmin, allDoctors);
admRout.post('/change-availability', authAdmin, changeAvailability); 
admRout.post('/delete', authAdmin, deleteDoctor);
admRout.get('/all-patients', authAdmin, allPatients);
admRout.get("/profile", authAdmin, adminProfile);
export default admRout;
