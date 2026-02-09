import express from 'express';
import { rdvController } from '../controllers/rdvCtrl.js';
import authDoctor from '../middlewares/authdoctor.js';
import authPatient from '../middlewares/authpatient.js';
import authAdmin from '../middlewares/authadmin.js';
import upload from '../middlewares/upload.js';
const rdvRout = express.Router();


rdvRout.patch('/:rdvId/read', authPatient, rdvController.confirmRead);
rdvRout.get('/my-rdvs', authPatient, rdvController.getPatientRdvs);
rdvRout.patch('/:rdvId/fichier-rep', authPatient, upload.single('fichier'), rdvController.uploadFichierRep);

rdvRout.post('/', authDoctor, upload.single('fichier'), rdvController.createRdv);

rdvRout.patch('/:rdvId/fichier', upload.single('fichier'), rdvController.uploadFichier);


rdvRout.get('/doctor/my-rdvs', authDoctor, rdvController.getDoctorRdvs);
rdvRout.get('/admin/hopital-rdvs', authAdmin, rdvController.getAdminRdvs);
export default rdvRout;