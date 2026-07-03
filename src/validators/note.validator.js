const { z } = require('zod');

const createNoteSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Title is required'),
    content: z.string().trim().min(1, 'Content is required'),
    color: z.string().trim().optional(),
  }),
});

const updateNoteSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).optional(),
    content: z.string().trim().min(1).optional(),
    color: z.string().trim().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
  params: z.object({
    id: z.string().uuid('Invalid note ID format'),
  }),
});

const noteIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid note ID format'),
  }),
});

module.exports = {
  createNoteSchema,
  updateNoteSchema,
  noteIdParamSchema,
};
