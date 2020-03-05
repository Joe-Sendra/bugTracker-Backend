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
    const createdEntry = await issueEntry.save();
    res.json(createdEntry);
  } catch (error) {
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
  try {
    // TODO validate req.body against schema
    await IssueEntry.findByIdAndUpdate(issueId, req.body, { new: true }, (err, issue) => {
      if (!err) { res.status(200).json(issue); }
    }).catch((error) => {
      res.status(422);
      throw new Error('Can not update issue', error);
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
