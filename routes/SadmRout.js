import express from 'express';
import {  createAdmin,loginSAdmin,sadminProfile,allDoctors,allMachines,allPatients,allAdmins,updateAdmin, updateAdminPassword} from '../controllers/sAdmin.js';
import authsAdmin from '../middlewares/sAuth.js'
const sadmRout = express.Router();

sadmRout.post('/add-admin',authsAdmin, createAdmin);
sadmRout.post('/login', loginSAdmin);
sadmRout.get("/profile",authsAdmin ,sadminProfile);
sadmRout.get("/doc",authsAdmin ,allDoctors);
sadmRout.get("/mac",authsAdmin ,allMachines);
sadmRout.get("/pat",authsAdmin ,allPatients);
sadmRout.get("/adm",authsAdmin ,allAdmins);
sadmRout.patch('/:id', authsAdmin, updateAdmin); 
sadmRout.patch('/:id/password', authsAdmin, updateAdminPassword); 
export default sadmRout;
