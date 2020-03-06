const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredString = {
  type: String,
  required: true,
};

const issueEntrySchema = new Schema({
  project: requiredString,
  type: requiredString,
  status: requiredString,
  priority: requiredString,
  summary: requiredString,
  description: String,
}, {
  timestamps: true,
});

const IssueEntry = mongoose.model('IssueEntry', issueEntrySchema);

module.exports = IssueEntry;
