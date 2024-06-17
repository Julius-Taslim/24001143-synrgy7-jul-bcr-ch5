import { Router, Request, Response } from 'express';
import orderService from '../services/orderService';
const router: Router = Router();

router.get('/', orderService.getOrders);
router.get('/:id', orderService.getOrderById);
router.post('/', orderService.createOrder);
router.delete('/:id', orderService.deleteOrderById);

export default router;