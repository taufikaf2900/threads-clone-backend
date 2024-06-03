import express from 'express';
import UserController from '../controllers/userController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';

const router = express.Router();

router.post('/signup', UserController.signUp);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.use(authenticationMiddleware);
router.post('/follow-unfollow/:id', UserController.followUnfollow);
router.patch('/current-user', UserController.updateProfile);
router.get('/:username/profile', UserController.getProfile);

export default router;
