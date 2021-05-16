const express = require('express');
const router = express.Router();
const divesites = require('../controllers/divesites');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateDivesite } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Divesite = require('../models/divesite');

router.route('/')
    .get(catchAsync(divesites.index))
    .post(isLoggedIn, upload.array('image'), validateDivesite, catchAsync(divesites.createDivesite))

router.get('/new', isLoggedIn, divesites.renderNewForm)

router.route('/:id')
    .get(catchAsync(divesites.showDivesite))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateDivesite, catchAsync(divesites.updateDivesite))
    .delete(isLoggedIn, isAuthor, catchAsync(divesites.deleteDivesite));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(divesites.renderEditForm))

module.exports = router;