import express from 'express';
import { 
  addMachine, 
  allMachines, 
  changerAvailability, 
  changeStatut 
} from '../controllers/machineCtrl.js';
import authAdmin from '../middlewares/authadmin.js';
import authDoctor from '../middlewares/authdoctor.js';
import auth from '../middlewares/auth.js';
const macRout = express.Router();

// Routes Admin
macRout.post('/add', authAdmin, addMachine);
macRout.get('/list', auth,allMachines); 
macRout.post('/change-statut', authAdmin, changeStatut);

// Routes Doctor
macRout.post('/changer-availability', authDoctor, changerAvailability);

export default macRout;
