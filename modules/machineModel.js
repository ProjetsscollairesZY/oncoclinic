import mongoose from "mongoose";
const imagerieSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  hopital: {
    type: String,
    required: true,
  },
  numeroSerie: {
    type: String,
    required: true,
    unique: true
  },
  isDisponible: {
    type: Boolean,
    default: true, 
  },
  isInMaintenance: {
    type: Boolean,
    default: false, 
  },

}, { timestamps: true });

export default mongoose.model("Imagerie", imagerieSchema);
