import jwt from 'jsonwebtoken';
import Doctor from '../modules/docteurModels.js';

const authDoctor = async (req, res, next) => {
  try {
    const dtoken = req.headers['dtoken'] || req.headers['Dtoken'] || req.headers['authorization']?.split(' ')[1]; 

    if (!dtoken) {
      return res.status(401).json({ success: false, message: 'Non autorisé, réessayez' });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

   
const doctor = await Doctor.findById(token_decode.id);
req.user = {
  id: doctor._id.toString(), 
  hopital: doctor.hopital,
  role: "Doctor",
  name: doctor.name 
};
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }
};

export default authDoctor;
