import jwt from 'jsonwebtoken';

const verifyToken = (token) => {
  try {
    // Token's decoded
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw error;
  }
};

export default verifyToken;
