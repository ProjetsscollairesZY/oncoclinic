import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    identifiant: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    numero: { type: Number, required: true },
    dateNaissance: { type: Date, required: true },
    adresse: { type: String, required: true },
    sexe: { type: String, required: true },
    numerodesecurity: { type: String, required: true },
    groupeSanguin: { type: String, required: true },
    typeCancer: { type: String, required: true },
    allergies: { type: String },
    hopital: { type: String, required: true },
    dateDiagnostic: { type: Date, required: true },
    stadeCancer: { type: Number, required: true },
    chirurgiesfaites: { type: String, required: true },
    maladiechroniques: { type: String },
    antecedents: { type: String },
    numeroSalle: { type: String },
medecinTraitant: { 
  id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  nom: { type: String, required: true }
},

},
  { timestamps: true } 
);

const PatientModel = mongoose.models.Patient || mongoose.model("Patient", patientSchema);
export default PatientModel;