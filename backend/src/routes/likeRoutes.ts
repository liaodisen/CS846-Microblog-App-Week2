import { Router } from 'express';
import { likeController } from '../controllers/likeController.js';

const router = Router();

router.post('/posts/:postId', (req, res) => likeController.likePost(req, res));
router.delete('/posts/:postId', (req, res) => likeController.unlikePost(req, res));
router.post('/replies/:replyId', (req, res) => likeController.likeReply(req, res));
router.delete('/replies/:replyId', (req, res) => likeController.unlikeReply(req, res));

export default router;
