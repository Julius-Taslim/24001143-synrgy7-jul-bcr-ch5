import {Router, Request, Response} from 'express';
import carService from '../services/carService';
import cdnUploadHandler from '../middlewares/cdnUploadHandler';
const router:Router = Router();

router.get('/',carService.getCars);
router.get('/:id', carService.getCarById);
router.post('/',cdnUploadHandler.single("image"),carService.addCar);
router.delete('/:id', carService.deleteCarById);
router.patch('/:id', cdnUploadHandler.single("image"), carService.updateCarById);

export default router;

