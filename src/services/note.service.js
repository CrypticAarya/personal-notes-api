const prisma = require('../lib/prisma');

const createNote = async (userId, data) => {
  return prisma.note.create({
    data: {
      ...data,
      userId,
    },
  });
};

const getNotes = async (userId) => {
  return prisma.note.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getNoteById = async (userId, noteId) => {
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!note || note.isDeleted) {
    const error = new Error('Note not found');
    error.status = 404;
    throw error;
  }

  if (note.userId !== userId) {
    const error = new Error('Access denied');
    error.status = 403;
    throw error;
  }

  return note;
};

const updateNote = async (userId, noteId, data) => {
  await getNoteById(userId, noteId); // Validate existence and ownership

  return prisma.note.update({
    where: { id: noteId },
    data,
  });
};

const deleteNote = async (userId, noteId) => {
  await getNoteById(userId, noteId); // Validate existence and ownership

  return prisma.note.update({
    where: { id: noteId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
