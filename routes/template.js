const express = require('express');
const router = express.Router();

const {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/templateController');

const { uploadTemplate } = require('../middlewares/upload');

// ROUTES
router.get('/', getAllTemplates);
router.post('/', uploadTemplate.single('image'), createTemplate);
router.put('/:id', uploadTemplate.single('image'), updateTemplate);
router.delete('/:id', deleteTemplate);

module.exports = router;