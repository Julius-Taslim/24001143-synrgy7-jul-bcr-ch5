import { Router, Request, Response } from 'express';
import userService from '../services/userService';
const router: Router = Router();

router.get('/', userService.getUsers);
router.get('/:id', userService.getUsersById);
router.post('/signIn', userService.UserSignIn);
router.delete('/:id', userService.deleteUserById);

export default router;