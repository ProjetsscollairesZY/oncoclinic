import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  identifiant: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  numero: { type: String, required: true }, 
  specialite: { type: String, required: true },
  hopital: { type: String, required: true },
  available: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  adminTraitant: { 
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    nom: { type: String, required: true },
    prenom: { type: String, required: true }
  },

  
});

export default mongoose.model("Doctor", doctorSchema);
