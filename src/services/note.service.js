const prisma = require('../lib/prisma');

const createNote = async (userId, data) => {
  return prisma.note.create({
    data: {
      ...data,
      userId,
    },
  });
};

const getNotes = async (userId, options = {}) => {
  const { search, sortBy = 'createdAt', sortOrder = 'desc', color } = options;
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;

  const where = {
    userId,
    isDeleted: false,
  };

  if (color) {
    where.color = color;
  }

  if (search) {
    const isPostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres');
    const searchCondition = { contains: search, ...(isPostgres ? { mode: 'insensitive' } : {}) };
    where.OR = [
      { title: searchCondition },
      { content: searchCondition },
    ];
  }

  const skip = (page - 1) * limit;

  const [totalItems, data] = await prisma.$transaction([
    prisma.note.count({ where }),
    prisma.note.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    meta: {
      currentPage: page,
      pageSize: limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    }
  };
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
