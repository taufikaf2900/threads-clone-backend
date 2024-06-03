import jwt from 'jsonwebtoken';

const generateToken = (payload) => {
  const { _id, name, username, email, profilePic } = payload;

  return jwt.sign(
    { _id, name, username, email, profilePic },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '30d',
    }
  );
};

export default generateToken;
