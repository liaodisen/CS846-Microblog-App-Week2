import { Router } from 'express';
import { replyController } from '../controllers/replyController.js';

const router = Router();

router.post('/', (req, res) => replyController.createReply(req, res));
router.get('/:replyId', (req, res) => replyController.getReply(req, res));
router.get('/post/:postId', (req, res) => replyController.getPostReplies(req, res));
router.patch('/:replyId', (req, res) => replyController.updateReply(req, res));
router.delete('/:replyId', (req, res) => replyController.deleteReply(req, res));

export default router;
