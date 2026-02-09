import Rdv from '../modules/rdvModels.js';
import doctorModel from "../modules/docteurModels.js";

export const rdvController = {

 
  createRdv: async (req, res) => {
    try {
      const { dateRdv, description, motif, salle, patientId, hopital, medecinsintervenants } = req.body;
      const fichierPath = req.file ? req.file.path : null;
  
      const newRdv = await Rdv.create({
        dateRdv,
        description,
        motif,
        salle,
        patientId,
        hopital,
        medecinId: req.user.id,
        medecinsintervenants,
        fichier: fichierPath
      });
  
      return res.status(201).json({ success: true, data: newRdv });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },


    uploadFichierRep: async (req, res) => {
    try {
      const { rdvId } = req.params;
      const fichierPath = req.file ? req.file.path : null;

      if (!fichierPath) {
        return res.status(400).json({ success: false, message: "Aucun fichier fourni." });
      }

      const rdv = await Rdv.findByIdAndUpdate(
        rdvId,
        { fichierRep: fichierPath },
        { new: true }
      );

      if (!rdv) {
        return res.status(404).json({ success: false, message: "RDV introuvable" });
      }

      res.status(200).json({ success: true, data: rdv });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },


 uploadFichier: async (req, res) => {
    try {
      const { rdvId } = req.params;
      const fichierPath = req.file ? req.file.path : null;
  
      if (!fichierPath) {
        return res.status(400).json({ success: false, message: "Aucun fichier fourni." });
      }
  
      const rdv = await Rdv.findByIdAndUpdate(
        rdvId,
        { fichier: fichierPath },
        { new: true }
      );
  
      if (!rdv) {
        return res.status(404).json({ success: false, message: "RDV introuvable" });
      }
  
      res.status(200).json({ success: true, data: rdv });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  confirmRead: async (req, res) => {
    try {
      const { rdvId } = req.params;

      const updatedRdv = await Rdv.findOneAndUpdate(
        { _id: rdvId, patientId: req.user.id },
        { luParPatient: true },
        { new: true }
      );

      if (!updatedRdv) {
        return res.status(404).json({ success: false, message: "RDV non trouvé" });
      }

      return res.json({ success: true, data: updatedRdv });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },


  getPatientRdvs: async (req, res) => {
    try {
      const rdvs = await Rdv.find({ patientId: req.user.id })
                          .sort({ dateRdv: -1 });

      return res.json({ success: true, data: rdvs });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
 

  getDoctorRdvs: async (req, res) => {
    try {
      const rdvs = await Rdv.find({ medecinId: req.user.id })
                         .populate('patientId', 'name')
                         .sort({ dateRdv: -1 });
      return res.json({ success: true, data: rdvs });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
// Pour les admins - Récupérer les RDV de leurs médecins
getAdminRdvs: async (req, res) => {
  try {
    // 1. Récupérer les médecins de l'admin (comme dans allDoctors)
    const doctors = await doctorModel.find({ 
      'adminTraitant.id': req.user.id 
    }).select('_id');

    // 2. Extraire les IDs des médecins
    const doctorIds = doctors.map(doc => doc._id);

    // 3. Récupérer les RDV de ces médecins
    const rdvs = await Rdv.find({ 
      medecinId: { $in: doctorIds }
    })
    .populate('patientId', 'name')
    .populate('medecinId', 'name')
    .sort({ dateRdv: -1 });

    return res.json({ success: true, data: rdvs });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
},
};

