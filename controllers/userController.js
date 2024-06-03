import comparePassword from '../helpers/comparePassword.js';
import encryptPassword from '../helpers/encryptPassword.js';
import generateToken from '../helpers/generateToken.js';
import User from '../models/userModel.js';

class UserController {
  static async signUp(req, res, next) {
    try {
      // throw { statusCode: 404, message: 'Not Found' };
      const { name, email, username, password } = req.body;

      const user = await User.findOne({
        $or: [{ email: email }, { username: username }],
      });

      if (user) {
        throw { statusCode: 400, message: 'User already exists' };
      }

      const hashedPassword = encryptPassword(password);

      const newUser = new User({
        name: name,
        email: email,
        username: username,
        password: hashedPassword,
      });
      await newUser.save();

      if (newUser) {
        const accessToken = generateToken(newUser);

        res.cookie('jwt', accessToken, {
          path: '/',
          signed: true,
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          httpOnly: true, // Cannot be accessed by browsers
          sameSite: 'strict', // For CRSF
        });
        res.status(201).json({
          _id: newUser._id,
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
        });
      } else {
        throw { statusCode: 400, message: 'Invalid user data' };
      }
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { username = '', password = '' } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        throw { statusCode: 401, message: 'Invalid username or password' };
      }

      const isPasswordMatch = comparePassword(password, user.password);

      if (!isPasswordMatch) {
        throw { statusCode: 401, message: 'Invalid username or password' };
      }

      const accessToken = generateToken(user);

      res.cookie('jwt', accessToken, {
        path: '/',
        signed: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true, // Cannot be accessed by browsers
        sameSite: 'strict', // For CRSF
      });

      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      res.clearCookie('jwt', { maxAge: 0 });
      res
        .status(200)
        .json({ success: true, message: 'User logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async followUnfollow(req, res, next) {
    try {
      const { id } = req.params;
      const userToFollowUnfollow = await User.findById(id);

      if (!userToFollowUnfollow) {
        throw {
          statusCode: 404,
          message: 'User to be followed or unfollowed not found',
        };
      }

      const currentUser = await User.findById(req.user._id);
      // console.log(currentUser);

      if (id === currentUser._id.toString()) {
        throw {
          statusCode: 400,
          message: 'You cannot to follow or unfollow yourself',
        };
      }

      const isFollowing = currentUser.followings.includes(id);

      if (isFollowing) {
        // Unfollow
        await User.findByIdAndUpdate(req.user._id, {
          $pull: { followings: id },
        }); // pull for remove item in array

        await User.findByIdAndUpdate(id, {
          $pull: { followers: currentUser._id },
        }); // pull for remove item in array

        const currentUserUpdated = await User.findById(req.user._id);

        res.status(200).json({
          success: true,
          message: 'Unfollowing successfully',
          followings: currentUserUpdated.followings,
        });
      } else {
        // Follow
        await User.findByIdAndUpdate(req.user._id, {
          $push: { followings: id },
        }); // push for remove item in array

        await User.findByIdAndUpdate(id, {
          $push: { followers: currentUser._id },
        }); // push for remove item in array

        const currentUserUpdated = await User.findById(req.user._id);

        res.status(200).json({
          success: true,
          message: 'Following successfully',
          followings: currentUserUpdated.followings,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      let { name, email, username, password, profilePic, bio } = req.body;
      const currentUser = await User.findById(req.user._id);

      if (!currentUser) {
        throw { statusCode: 404, message: 'User not found' };
      }

      if (!name) {
        name = currentUser.name;
      }

      if (!username) {
        username = currentUser.username;
      }

      if (!password) {
        password = currentUser.password;
      } else {
        const newPassword = encryptPassword(password);
        password = newPassword;
      }

      if (!email) {
        email = currentUser.email;
      }

      if (!profilePic) {
        profilePic = currentUser.profilePic;
      }

      if (!bio) {
        bio = currentUser.bio;
      }

      currentUser.name = name;
      currentUser.email = email;
      currentUser.password = password;
      currentUser.username = username;
      currentUser.profilePic = profilePic;
      currentUser.bio = bio;

      await currentUser.save();

      res.status(200).json({
        success: true,
        message: 'Update profile successfully',
        user: currentUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const { username } = req.params;
      const user = await User.findOne({ username: username })
        .select('-password')
        .select('-updatedAt');

      if (!user) {
        throw { statusCode: 404, message: 'User not found' };
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
