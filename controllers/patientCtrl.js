import Patient from '../modules/patientModels.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const patientProfile = async (req, res) => {
  try {
    const patientId = req.user.id;

    const patient = await Patient.findById(patientId).select("-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient non trouvé"
      });
    }

    res.json({
      success: true,
      profile: patient
    });

  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};


const patientLogin = async (req, res) => {
  try {
    const { identifiant, password } = req.body;

    const patient = await Patient.findOne({ identifiant });
    if (!patient) {
      return res.json({
        success: false,
        message: "Identifiant incorrect",
      });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Informations invalides" });
    }

    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, { expiresIn: '1d' });


    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Erreur de connexion patient:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};
export {patientLogin,patientProfile};



