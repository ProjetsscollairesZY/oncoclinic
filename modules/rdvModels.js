import mongoose from "mongoose";

const rdvSchema = new mongoose.Schema({
    dateRdv: {
        type: Date,
        required: true,
        validate: {
          validator: function(value) {
            return value > new Date();
          },
          message: 'La date du rendez-vous doit être dans le futur'
        }
      },
medecinsintervenants:{
  
  type: String,
  required: true,
},
fichier: {
  type: String 
},
fichierRep: {
  type: String 
},

  description: {
    type: String,
    required: true,
    trim: true
  },
  motif: {
    type: String,
    required: true,
    trim: true
  },
  salle: {
    type: String,
    required: true,
    trim: true
  },
  luParPatient: {
    type: Boolean,
    default: false 
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  medecinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  hopital: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});


const Rdv = mongoose.models.Rdv || mongoose.model('Rdv', rdvSchema);
export default Rdv;