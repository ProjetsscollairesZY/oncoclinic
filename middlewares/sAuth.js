import jwt from 'jsonwebtoken';
import SAdmin from '../modules/SAdminModels.js';

const sAuth = async (req, res, next) => {
  try {
    const { stoken } = req.headers;
    if (!stoken) {
      return res.status(403).json({ success: false, message: 'Accès interdit. Token manquant.' });
    }

    const decodedToken = jwt.verify(stoken, process.env.JWT_SECRET);

  
    const sadmin = await SAdmin.findById(decodedToken.id);
    if (!sadmin) {
      return res.status(403).json({ success: false, message: 'Accès interdit. Admin non trouvé.' });
    }

 
    req.user = { id: sadmin._id, hopital: sadmin.hopital };

    
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: 'Erreur serveur. Veuillez réessayer.' });
  }
};

export default sAuth;
