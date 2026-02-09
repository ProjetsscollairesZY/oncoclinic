import machineModel from '../modules/machineModel.js'; 
import validator from 'validator';
const machineList = async (req, res) => {
    try {
      const machines = await machineModel.find({}).select("-__v");
      res.json({ success: true, machines });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };

  const addMachine = async (req, res) => {
    try {
      const {
        type,
        location,
        hopital,
        isDisponible,
        isInMaintenance,
        numeroSerie,
      } = req.body;

      if (!type || !location || !hopital || !numeroSerie) {
        return res.status(400).json({
          success: false,
          message: "Tous les champs obligatoires doivent être remplis : type, location, hopital, numeroSerie",
        });
      }

      if (hopital !== req.user.hopital) {
        return res.status(403).json({
          success: false,
          message: "Vous ne pouvez pas ajouter des machines dans un autre hôpital.",
        });
      }

      const newMachine = new machineModel({
        type,
        numeroSerie,
        location,
        hopital,
        isDisponible: Boolean(isDisponible),
        isInMaintenance: Boolean(isInMaintenance),
      });

      await newMachine.save();

      return res.status(201).json({
        success: true,
        message: "Machine ajoutée avec succès",
        data: newMachine,
      });
    } catch (error) {
      console.error("Erreur:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
};

  

  const allMachines = async (req, res) => {
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
  

  //////////////////
  const changerAvailability = async (req, res) => {
    try {
      const { machineId } = req.body;
  
      const machine = await machineModel.findById(machineId);
      if (!machine) {
        return res.json({ success: false, message: "Machine non trouvée" });
      }
  
      await machineModel.findByIdAndUpdate(machineId, {
        isDisponible: !machine.isDisponible,
      });
  
      res.json({ success: true, message: "Disponibilité de la machine modifiée" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  ///////////////////
  const changeStatut = async (req, res) => {
    try {
        const { machineId } = req.body;

        const updatedMachine = await machineModel.findByIdAndUpdate(
            machineId,
            [{
                $set: {
                    isInMaintenance: { $not: "$isInMaintenance" }
                }
            }],
            { new: true }
        );

        if (!updatedMachine) {
            return res.status(404).json({ 
                success: false, 
                message: "Machine non trouvée" 
            });
        }

        res.json({ 
            success: true, 
            message: "Statut modifié",
            machine: updatedMachine 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Erreur serveur" 
        });
    }
};
  export{
    machineList,
    changeStatut,
    changerAvailability,
    allMachines,
    addMachine
  }