const { Router } = require('express');

const IssueEntry = require('../models/issueEntry');
const middleware = require('./issues.middlewares');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const entries = await IssueEntry.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post('/', middleware.checkProperties, middleware.validateIssue, async (req, res, next) => {
  try {
    const issueEntry = new IssueEntry(req.body);
    const createdEntry = await issueEntry.save();
    res.json(createdEntry);
  } catch (error) {
    next(error);
  }
});


router.get('/:id', middleware.isValidIdFormat, async (req, res, next) => {
  const issueId = req.params.id;
  try {
    const entry = await IssueEntry.findOne({ _id: issueId });
    if (entry) {
      res.json(entry);
    } else {
      res.status(404);
      throw new Error('Invalid issue ID submitted');
    }
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/:id',
  middleware.isValidIdFormat,
  middleware.checkProperties,
  async (req, res, next) => {
    const issueId = req.params.id;
    try {
      await IssueEntry.findByIdAndUpdate(issueId, req.body, { new: true }, (err, issue) => {
        if (!err) { res.status(200).json(issue); }
      }).catch((error) => {
        res.status(422);
        throw new Error('Can not update issue');
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete('/:id', middleware.isValidIdFormat, async (req, res, next) => {
  const issueId = req.params.id;
  try {
    const entry = await IssueEntry.findOne({ _id: issueId });
    if (entry) {
      entry.remove();
    }
    res.status(204);
    res.json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
