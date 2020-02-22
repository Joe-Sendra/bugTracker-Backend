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

module.exports = router;
