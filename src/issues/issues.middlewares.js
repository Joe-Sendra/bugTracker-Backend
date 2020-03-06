const IssueEntry = require('../models/issueEntry');

function isValidIdFormat(req, res, next) {
  if (new RegExp('^[0-9a-fA-F]{24}$').test(req.params.id)) {
    next();
  } else {
    res.status(404);
    throw new Error('Invalid issue ID submitted');
  }
}

async function checkProperties(req, res, next) {
  try {
    // Check for unknown properties
    const keys = Object.keys(IssueEntry.schema.paths);
    Object.keys(req.body).forEach((prop) => {
      if (prop === 'createdAt' || prop === 'updatedAt') {
        res.status(422);
        throw new Error(`Property name "${prop}" can not be manually updated`);
      }
      if (!keys.includes(prop)) {
        res.status(422);
        throw new Error(`Unknown property name: "${prop}"`);
      }
    });
    next();
  } catch (error) {
    next(error);
  }
}

async function validateIssue(req, res, next) {
  try {
    const issueEntry = new IssueEntry(req.body);
    await issueEntry.validate((err) => {
      if (err) {
        res.status(422);
        if (err.errors.project) { next(new Error(err.errors.project.message)); }
        if (err.errors.type) { next(new Error(err.errors.type.message)); }
        if (err.errors.status) { next(new Error(err.errors.status.message)); }
        if (err.errors.priority) { next(new Error(err.errors.priority.message)); }
        if (err.errors.summary) { next(new Error(err.errors.summary.message)); }
      }
    });
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  isValidIdFormat,
  checkProperties,
  validateIssue,
};
