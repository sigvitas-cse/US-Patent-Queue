const mongoose = require("mongoose");

const patentSchema = new mongoose.Schema({
  patent_number: { type: String, required: true, unique: true },
  assignee: {
    organization: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String }
  },
  inventors: [{
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    country: { type: String }
  }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Patent", patentSchema);