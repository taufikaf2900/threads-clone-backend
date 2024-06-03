import verifyToken from '../helpers/verifyToken.js';
import User from '../models/userModel.js';

const authenticationMiddleware = async (req, res, next) => {
  try {
    const token = req.signedCookies['jwt'];

    if (!token) {
      throw { statusCode: 401, message: 'Unauthenticated' };
    }

    const decodedToken = verifyToken(token);

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw { statusCode: 401, message: 'Unauthenticated' };
    }

    req.user = {
      _id: decodedToken._id,
      name: decodedToken.name,
      username: decodedToken.username,
      email: decodedToken.email,
      profilePic: decodedToken.profilePic,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticationMiddleware;
