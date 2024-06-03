import express from 'express';
import PostController from '../controllers/postController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';

const router = express.Router();

router.use(authenticationMiddleware);
router.post('/', PostController.createPost);
router.get('/', PostController.getAllPostsOrFeedPosts);
router.get('/current-user', PostController.getAllCurrentUserPosts);
router.get('/by-id/:postId', PostController.getPostById);
router.get('/:userId', PostController.getAllPostByUserId);
router.delete('/:postId', PostController.deletePost);
router.patch('/like-unlike/:postId', PostController.likeUnlikePost);
router.post('/reply/:postId', PostController.replyPost);

export default router;
