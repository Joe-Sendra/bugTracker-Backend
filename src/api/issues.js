const { Router } = require('express');

const IssueEntry = require('../models/issueEntry');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const entries = await IssueEntry.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const issueEntry = new IssueEntry(req.body);
    const createdEntry = await issueEntry.save();
    res.json(createdEntry);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422);
    }
    next(error);
  }
});


router.get('/:id', async (req, res, next) => {
  const issueId = req.params.id;
  try {
    if (issueId) {
      const entry = await IssueEntry.findOne({ _id: issueId });
      res.json(entry);
    } else {
      throw new Error('Invalid issue ID submitted');
    }
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  const issueId = req.params.id;
  const updateInfo = req.body;

  try {
    const entry = await IssueEntry.findOne({ _id: issueId });
    let updatedIssue;

    // eslint-disable-next-line no-prototype-builtins
    if (updateInfo.hasOwnProperty('project')) {
      updatedIssue = {
        ...updatedIssue,
        project: updateInfo.project,
      };
    }
    // eslint-disable-next-line no-prototype-builtins
    if (updateInfo.hasOwnProperty('type')) {
      updatedIssue = {
        ...updatedIssue,
        type: updateInfo.type,
      };
    }
    // eslint-disable-next-line no-prototype-builtins
    if (updateInfo.hasOwnProperty('status')) {
      updatedIssue = {
        ...updatedIssue,
        status: updateInfo.status,
      };
    }
    // eslint-disable-next-line no-prototype-builtins
    if (updateInfo.hasOwnProperty('priority')) {
      updatedIssue = {
        ...updatedIssue,
        priority: updateInfo.priority,
      };
    }
    // eslint-disable-next-line no-prototype-builtins
    if (updateInfo.hasOwnProperty('summary')) {
      updatedIssue = {
        ...updatedIssue,
        summary: updateInfo.summary,
      };
    }
    // eslint-disable-next-line no-prototype-builtins
    if (updateInfo.hasOwnProperty('description')) {
      updatedIssue = {
        ...updatedIssue,
        description: updateInfo.description,
      };
    }
    entry.updateOne(updateInfo, { upsert: true }, (err, result) => {
      if (result.nModified > 0) {
        // Successfully updated
        return res.status(200).json(updatedIssue);
      }
      const errorMsg = 'Issue could not be updated.';
      throw new Error(errorMsg);
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
