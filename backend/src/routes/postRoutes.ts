import { Router } from 'express';
import { postController } from '../controllers/postController.js';

const router = Router();

router.get('/feed', (req, res) => postController.getFeed(req, res));
router.post('/', (req, res) => postController.createPost(req, res));
router.get('/:postId', (req, res) => postController.getPost(req, res));
router.patch('/:postId', (req, res) => postController.updatePost(req, res));
router.delete('/:postId', (req, res) => postController.deletePost(req, res));
router.get('/user/:userId', (req, res) => postController.getUserPosts(req, res));

export default router;
