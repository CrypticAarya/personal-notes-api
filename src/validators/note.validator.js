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

const getNotesQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive('Page must be a positive number').optional().default(1),
    limit: z.coerce.number().int().positive('Limit must be a positive number').optional().default(10),
    sortBy: z.enum(['createdAt', 'updatedAt', 'title']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    color: z.string().trim().optional(),
  }),
});

module.exports = {
  createNoteSchema,
  updateNoteSchema,
  noteIdParamSchema,
  getNotesQuerySchema,
};
