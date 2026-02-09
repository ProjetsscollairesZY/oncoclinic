import doctorModel from "../modules/docteurModels.js";
import Patient from "../modules/patientModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import PatientModel from '../modules/patientModels.js';

const doctorLogin = async (req, res) => {
  try {
    const { identifiant, password } = req.body;

    const doctor = await doctorModel.findOne({ identifiant });
    if (!doctor) {
      return res.json({
        success: false,
        message: "Identifiant incorrect",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({ success: false, message: "Informations invalides" });
    }
  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.status(404).json({ success: false, message: "Docteur non trouvé" });
    }

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({ success: true, message: "Disponibilité du docteur modifiée" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find({})
      .select(["-password", "-identifiant"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const addPatient = async (req, res) => {
  try {
    const {
      identifiant,
      password,
      name,
      numero,
      dateNaissance,
      adresse,
      sexe,
      numerodesecurity,
      groupeSanguin,
      typeCancer,
      allergies = "aucune",
      stadeCancer,
      dateDiagnostic,
      hopital,
      chirurgiesfaites = "aucune",
      maladiechroniques = "aucune",
      antecedents,
      numeroSalle,
    } = req.body;

    const medecinConnecte = await doctorModel.findById(req.user.id);
    if (!medecinConnecte) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé : médecin non trouvé"
      });
    }

    const requiredFields = [
      'identifiant', 'password', 'name', 'numero', 'dateNaissance',
      'adresse', 'sexe', 'numerodesecurity', 'groupeSanguin',
      'typeCancer', 'stadeCancer', 'dateDiagnostic', 'hopital'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Champs manquants : ${missingFields.join(', ')}`
      });
    }

    
    if (isNaN(new Date(dateNaissance).getTime()) || isNaN(new Date(dateDiagnostic).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Format de date invalide (utiliser YYYY-MM-DD)"
      });
    }

    const existingPatient = await Patient.findOne({ identifiant });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Cet identifiant est déjà utilisé"
      });
    }

 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
 
    
      if (hopital !== req.user.hopital) {
        return res.status(403).json({
          success: false,
          message: "Vous ne pouvez pas ajouter des patients dans un autre hôpital.",
        });
      }




    const newPatient = new Patient({
      identifiant,
      password: hashedPassword,
      name,
      numero,
      dateNaissance: new Date(dateNaissance),
      adresse,
      sexe,
      numerodesecurity,
      groupeSanguin,
      typeCancer,
      allergies,
      stadeCancer: Number(stadeCancer), 
      dateDiagnostic: new Date(dateDiagnostic),
      hopital,
      chirurgiesfaites,
      maladiechroniques,
      antecedents,
      numeroSalle,
      medecinTraitant: {
        id: medecinConnecte._id,
        nom: medecinConnecte.name
        
      }
    });

    await newPatient.save();

    const patientResponse = newPatient.toObject();
    delete patientResponse.password;

    return res.status(201).json({
      success: true,
      message: "Patient créé avec succès",
      data: patientResponse
    });

  } catch (error) {
    console.error("Erreur:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Identifiant déjà utilisé"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const allPatients = async (req, res) => {
  try {
    const patients = await PatientModel.find({ 'medecinTraitant.id': req.user.id }).select('-password');
    res.json({ success: true, patients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const doctorProfile = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const doctor = await doctorModel.findById(doctorId).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Médecin non trouvé"
      });
    }

    res.json({
      success: true,
      profile: doctor
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
 const updatePatient = async (req, res) => {
  try {
    const { hopital, stadeCancer, allergies, chirurgiesfaites, medecinTraitantId,numeroSalle } = req.body;
    const { patientId } = req.params; // Utiliser les params de l'URL, pas req.body pour l'ID

    const patient = await PatientModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient non trouvé" });
    }

    const doctor = await doctorModel.findById(medecinTraitantId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Médecin traitant non trouvé" });
    }

    // Mettre à jour les champs uniquement s'ils sont présents dans req.body
    patient.hopital = hopital || patient.hopital;
    patient.stadeCancer = stadeCancer || patient.stadeCancer;
    patient.allergies = allergies || patient.allergies;
    patient.chirurgiesfaites = chirurgiesfaites || patient.chirurgiesfaites;
    patient.medecinTraitant = { id: doctor._id, nom: doctor.name };
patient.numeroSalle = numeroSalle ||  patient.numeroSalle;
    await patient.save();

    res.status(200).json({ success: true, message: "Patient mis à jour avec succès", data: patient });
  } catch (error) {
    console.error("Erreur de mise à jour:", error);
    res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
  }
};
const getDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({})
      .select(["-password"]) // Exclut les données sensibles
      .sort({ name: 1 }); // Trie par ordre alphabétique

    res.status(200).json({
      success: true,
      doctors
    });

  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur"
    });
  }
};

export {
  allPatients,
  addPatient,
  doctorList,
  doctorLogin,
  doctorProfile,
  updatePatient,
  getDoctors
};