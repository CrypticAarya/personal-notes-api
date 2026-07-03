const noteService = require('../services/note.service');
const { successResponse, errorResponse } = require('../utils/response');

const createNote = async (req, res) => {
  try {
    const note = await noteService.createNote(req.user.id, req.body);
    return successResponse(res, 201, note);
  } catch (error) {
    console.error('Create note error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

const getNotes = async (req, res) => {
  try {
    const result = await noteService.getNotes(req.user.id, req.query);
    return successResponse(res, 200, result.data, result.meta);
  } catch (error) {
    console.error('Get notes error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

const getNoteById = async (req, res) => {
  try {
    const note = await noteService.getNoteById(req.user.id, req.params.id);
    return successResponse(res, 200, note);
  } catch (error) {
    if (error.status) {
      return errorResponse(res, error.status, error.message);
    }
    console.error('Get note by id error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await noteService.updateNote(req.user.id, req.params.id, req.body);
    return successResponse(res, 200, note);
  } catch (error) {
    if (error.status) {
      return errorResponse(res, error.status, error.message);
    }
    console.error('Update note error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

const deleteNote = async (req, res) => {
  try {
    await noteService.deleteNote(req.user.id, req.params.id);
    // For 204 No Content, we can just send the status since there is no body
    return res.status(204).send();
  } catch (error) {
    if (error.status) {
      return errorResponse(res, error.status, error.message);
    }
    console.error('Delete note error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
