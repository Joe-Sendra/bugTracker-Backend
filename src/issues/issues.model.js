const mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
const db = require('../db/connection');

const { Schema } = mongoose;

const issueEntrySchema = new Schema({
  project: {
    type: String,
    required: [true, '"project" is required'],
  },
  type: {
    type: String,
    required: [true, '"type" is required'],
  },
  status: {
    type: String,
    required: [true, '"status" is required'],
  },
  priority: {
    type: String,
    required: [true, '"priority" is required'],
  },
  summary: {
    type: String,
    required: [true, '"summary" is required'],
  },
  description: String,
}, {
  timestamps: true,
});

const IssueEntry = mongoose.model('IssueEntry', issueEntrySchema);

module.exports = IssueEntry;
