const express = require('express');
const noteController = require('../controllers/note.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateRequest } = require('../validators/auth.validator'); // Reusing validateRequest
const { createNoteSchema, updateNoteSchema, noteIdParamSchema } = require('../validators/note.validator');

const router = express.Router();

router.use(authenticate);

router.post('/', validateRequest(createNoteSchema), noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', validateRequest(noteIdParamSchema), noteController.getNoteById);
router.patch('/:id', validateRequest(updateNoteSchema), noteController.updateNote);
router.delete('/:id', validateRequest(noteIdParamSchema), noteController.deleteNote);

module.exports = router;
