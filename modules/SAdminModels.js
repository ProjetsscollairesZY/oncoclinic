import mongoose from "mongoose";
import bcrypt from "bcrypt";

const sadminSchema = new mongoose.Schema({
  identifiant: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  hopital: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});


sadminSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

export default mongoose.model("SAdmin", sadminSchema);
