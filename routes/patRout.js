import express from 'express';
import {patientLogin,patientProfile}  from '../controllers/patientCtrl.js'; 
import authPatient from "../middlewares/authPatient.js";

const patRout = express.Router();
patRout.get("/profile", authPatient, patientProfile);

patRout.post('/login', patientLogin);

export default patRout;
