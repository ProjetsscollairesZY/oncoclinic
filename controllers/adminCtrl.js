import validator from "validator";
import bcrypt from "bcrypt";

import jwt from 'jsonwebtoken'
import Admin from "../modules/adminModels.js"
import PatientModel from "../modules/patientModels.js"
import doctorModel from "../modules/docteurModels.js";
const addDocteur = async (req, res) => {
  try {
    const {
      name,
      identifiant,
      password,
      numero,
      specialite,
      hopital,
      available
    } = req.body;

    const adminConnect = await Admin.findById(req.user.id);
    if (!adminConnect) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé"
      });
    }

    if (!name || !identifiant || !password || !numero || !specialite || !hopital) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont obligatoires"
      });
    }

    if (!validator.isAlphanumeric(identifiant)) {
      return res.status(400).json({
        success: false,
        message: "L'identifiant doit être alphanumérique"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 8 caractères"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isAvailable = typeof available === 'boolean'
      ? available
      : (available === 'true');

    const newDoctor = new doctorModel({
      name,
      identifiant,
      password: hashedPassword,
      numero,
      specialite,
      hopital,
      available: isAvailable,
      date: new Date(),
      adminTraitant: {
        id: adminConnect._id,
        nom: adminConnect.nom,  
        prenom: adminConnect.prenom,
      }
    });

    await newDoctor.save();

    return res.status(201).json({
      success: true,
      message: "Docteur ajouté avec succès",
      data: newDoctor
    });

  } catch (error) {
    console.error("Erreur:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
};


const loginAdmin = async (req, res) => {
  try {
    const { identifiant, password } = req.body;

 
    const admin = await Admin.findOne({ identifiant });
    if (!admin) {
      return res.status(400).json({ success: false, message: "Identifiant invalide" });
    }

  
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Mot de passe incorrect" });
    }

  
    const token = jwt.sign(
      { id: admin._id, identifiant: admin.identifiant },  
      process.env.JWT_SECRET,                            
      { expiresIn: '8h' }                              
    );

    res.json({ success: true, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



///////////////////////////////////////////////////////////




const allDoctors = async (req, res) => {
  try {
    const adminId = req.user.id; 

    const doctors = await doctorModel
      .find({ 'adminTraitant.id': adminId }) 
      .select('-password');

    res.json({ success: true, doctors });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};





const allPatients = async (req, res) => {
  try {
    
    const hopital = req.user.hopital;


    const patients = await PatientModel.find({ hopital: hopital }).select('-password');

    res.json({ success: true, patients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

 const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "ID invalide ou manquant"
      });
    }

    const deleted = await doctorModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Médecin non trouvé"
      });
    }

    res.json({
      success: true,
      message: "Médecin supprimé avec succès"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
};



const adminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;

    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Administrateur non trouvé"
      });
    }

    res.json({
      success: true,
      profile: admin
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

export { adminProfile,addDocteur,allPatients, loginAdmin, allDoctors,deleteDoctor}; 