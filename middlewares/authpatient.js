import jwt from 'jsonwebtoken';
import Patient from '../modules/patientModels.js';

const authpatient = async (req, res, next) => {
  try {
    const ptoken = req.headers['ptoken'] || req.headers['Ptoken'] || req.headers['authorization']?.split(' ')[1];

    if (!ptoken) {
      return res.status(401).json({ success: false, message: 'Non autorisé, token manquant' });
    }

    const decoded = jwt.verify(ptoken, process.env.JWT_SECRET);

const patient = await Patient.findById(decoded.id);
req.user = {
  id: patient._id.toString(), 
  hopital: patient.hopital,
  role: "Patient",
  name: patient.name
};
    next();
  } catch (error) {
    console.error('Erreur authPatient:', error);
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }
};

export default authpatient;
