import express from 'express'
import { addPatient, doctorList, doctorLogin, allPatients,doctorProfile,updatePatient, getDoctors } from '../controllers/docteurCtrl.js'
import upload from '../middlewares/multer.js'
import authDoctor from '../middlewares/authdoctor.js'
const docRout = express.Router()
docRout.get('/list',doctorList)
docRout.post('/login',doctorLogin)
docRout.post('/add-patient', authDoctor,upload.single('image'), addPatient);
docRout.post('/all-patients',authDoctor, allPatients);
docRout.put("/update/:patientId", authDoctor, updatePatient);
docRout.get("/profile", authDoctor, doctorProfile);
docRout.get("/doctors", authDoctor, getDoctors);



export default docRout