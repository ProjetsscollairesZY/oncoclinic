import Admin from "../modules/adminModels.js"
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import SAdmin from "../modules/SAdminModels.js"
import machineModel from '../modules/machineModel.js'; 

import PatientModel from "../modules/patientModels.js"
import DoctorModel from "../modules/docteurModels.js";

export const createAdmin = async (req, res) => {
  const { identifiant, password, nom, prenom, hopital } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ identifiant });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Cet identifiant existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      identifiant,
      password: hashedPassword,
      nom,
      prenom,
      hopital
    });

    await newAdmin.save();

    return res.status(201).json({ success: true, message: "Admin ajouté avec succès" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const loginSAdmin = async (req, res) => {
  try {
    const { identifiant, password } = req.body;

 
    const sadmin = await SAdmin.findOne({ identifiant });
    if (!sadmin) {
      return res.status(400).json({ success: false, message: "Identifiant invalide" });
    }

  
    const isMatch = await bcrypt.compare(password, sadmin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Mot de passe incorrect" });
    }

  
    const token = jwt.sign(
      { id: sadmin._id, identifiant: sadmin.identifiant },  
      process.env.JWT_SECRET,                            
      { expiresIn: '8h' }                              
    );

    res.json({ success: true, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const sadminProfile = async (req, res) => {
  try {
    const sadminId = req.user.id;

    const sadmin = await SAdmin.findById(sadminId).select("-password");

    if (!sadmin) {
      return res.status(404).json({
        success: false,
        message: "Administrateur non trouvé"
      });
    }

    res.json({
      success: true,
      profile: sadmin
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
export const allMachines = async (req, res) => {
    try {
      const userHopital = req.user.hopital;
      
      if (!userHopital) {
        return res.status(403).json({ success: false, message: "Hôpital non trouvé pour cet utilisateur." });
      }
  
      
      const machines = await machineModel.find({ hopital: userHopital }).select('-__v');
  
      return res.json({ success: true, machines });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
};
export const allPatients = async (req, res) => {
  try {
    
    const hopital = req.user.hopital;


    const patients = await PatientModel.find({ hopital: hopital }).select('-password');

    res.json({ success: true, patients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const allDoctors = async (req, res) => {
  try {
    
    const hopital = req.user.hopital;


    const doctors = await DoctorModel.find({ hopital: hopital }).select('-password');

    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const allAdmins = async (req, res) => {
  try {
    
    const hopital = req.user.hopital;


    const admins = await Admin.find({ hopital: hopital }).select('');

    res.json({ success: true, admins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateAdminPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 10) {
      return res.status(400).json({ success: false, message: "Le mot de passe doit contenir au moins 10 caractères" });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin non trouvé" });
    }

    // Hash le nouveau mot de passe
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ success: true, message: "Mot de passe mis à jour" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, identifiant } = req.body;

    // Vérifie que l'admin existe
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin non trouvé" });
    }

    // Met à jour les infos
    admin.nom = nom || admin.nom;
    admin.prenom = prenom || admin.prenom;
    admin.identifiant = identifiant || admin.identifiant;

    await admin.save();

    res.json({ success: true, message: "Admin mis à jour", admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};