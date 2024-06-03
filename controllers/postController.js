import Post from '../models/postModel.js';
import User from '../models/userModel.js';

class PostController {
  static async createPost(req, res, next) {
    try {
      const { text, img } = req.body;

      if (!text && !img) {
        throw { statusCode: 400, message: 'Invalid post data' };
      }

      const maxLength = 500;

      if (text.length > maxLength) {
        throw { statusCode: 400, message: 'Text is to long' };
      }

      const newPost = new Post({
        postedBy: req.user._id,
        text,
        img,
      });

      await newPost.save();
      res.status(200).json({
        success: true,
        message: 'Create new post successfully',
        post: newPost,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllPostsOrFeedPosts(req, res, next) {
    try {
      const currentUser = await User.findById(req.user._id);
      const usersId = [currentUser._id, currentUser.followings];
      const posts = await Post.find({ postedBy: { $in: usersId } });

      posts.sort((a, b) => {
        const postA = a.createdAt;
        const postB = b.createdAt;

        if (postA < postB) {
          return 1;
        }
        if (postA > postB) {
          return -1;
        }

        return 0;
      });

      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllCurrentUserPosts(req, res, next) {
    try {
      const posts = await Post.find({ postedBy: req.user._id }).sort([
        ['createdAt', -1],
      ]);
      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllPostByUserId(req, res, next) {
    try {
      const { userId } = req.params;

      const posts = await Post.find({ postedBy: userId }).sort([
        ['createdAt', -1],
      ]);

      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPostById(req, res, next) {
    try {
      const { postId } = req.params;

      const post = await Post.findById(postId);

      if (!post) {
        throw { statusCode: 404, message: 'Post not found' };
      }

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePost(req, res, next) {
    try {
      const { postId } = req.params;

      const post = await Post.findById(postId);

      if (!post) {
        throw { statusCode: 404, message: 'Post not found' };
      }

      if (post.postedBy.toString() !== req.user._id.toString()) {
        throw { statusCode: 403, message: 'You cannot delete other user post' };
      }

      await Post.findByIdAndDelete(postId);
      res.status(200).json({
        success: true,
        message: 'Success deleting post',
      });
    } catch (error) {
      next(error);
    }
  }

  static async likeUnlikePost(req, res, next) {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId);

      if (!post) {
        throw { statusCode: 404, message: 'Post not found' };
      }

      const isLiking = post.likes.includes(req.user._id);

      if (isLiking) {
        await Post.findByIdAndUpdate(postId, {
          $pull: { likes: req.user._id },
        });

        res.status(200).json({
          success: true,
          message: 'Unlike post successfully',
        });
      } else {
        await Post.findByIdAndUpdate(postId, {
          $push: { likes: req.user._id },
        });

        res.status(200).json({
          success: true,
          message: 'Like post successfully',
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async replyPost(req, res, next) {
    try {
      const { postId } = req.params;
      const { text } = req.body;
      const { _id: userId, profilePic, username } = req.user;
      const post = await Post.findById(postId);

      if (!text) {
        throw { statusCode: 400, message: 'Comment text required' };
      }

      if (!post) {
        throw { statusCode: 404, message: 'Post not found' };
      }

      const newReplyPost = {
        userId: userId,
        text: text,
        userProfilePic: profilePic,
        username: username,
      };

      await Post.findByIdAndUpdate(postId, {
        $push: { replies: newReplyPost },
      });

      res.status(200).json({
        success: true,
        message: 'Reply post successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PostController;
