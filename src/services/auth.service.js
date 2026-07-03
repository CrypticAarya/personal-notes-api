const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { generateToken } = require('../utils/jwt');

const registerUser = async (data) => {
  const { email, password, firstName, lastName } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error('Email already in use');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  const token = generateToken({ id: user.id });

  return { user: userWithoutPassword, token };
};

const loginUser = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const { password: _, ...userWithoutPassword } = user;
  const token = generateToken({ id: user.id });

  return { user: userWithoutPassword, token };
};

module.exports = {
  registerUser,
  loginUser,
};
