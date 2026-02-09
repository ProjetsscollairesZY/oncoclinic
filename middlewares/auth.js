import jwt from 'jsonwebtoken';
import Admin from '../modules/adminModels.js';
import Doctor from '../modules/docteurModels.js';

const auth = async (req, res, next) => {
  try {
    const token = 
      req.headers['dtoken'] || 
      req.headers['atoken'] || 
      req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await Admin.findById(decoded.id);
    if (user) {
      req.user = { id: user._id, hopital: user.hopital, role: 'admin' };
      return next();
    }

    
    user = await Doctor.findById(decoded.id);
    if (user) {
      req.user = { id: user._id, hopital: user.hopital, role: 'doctor' };
      return next();
    }


    return res.status(403).json({ success: false, message: "Utilisateur non trouvé" });

  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }
};

export default auth;
