import jwt from 'jsonwebtoken';
import Admin from '../modules/adminModels.js';

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.status(403).json({ success: false, message: 'Accès interdit. Token manquant.' });
    }

    const decodedToken = jwt.verify(atoken, process.env.JWT_SECRET);

  
    const admin = await Admin.findById(decodedToken.id);
    if (!admin) {
      return res.status(403).json({ success: false, message: 'Accès interdit. Admin non trouvé.' });
    }

 
    req.user = { id: admin._id, hopital: admin.hopital };

    
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: 'Erreur serveur. Veuillez réessayer.' });
  }
};

export default authAdmin;
