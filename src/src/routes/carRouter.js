"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carService_1 = __importDefault(require("../services/carService"));
const cdnUploadHandler_1 = __importDefault(require("../middlewares/cdnUploadHandler"));
const router = (0, express_1.Router)();
router.get('/', carService_1.default.getCars);
router.get('/:id', carService_1.default.getCarById);
router.post('/', cdnUploadHandler_1.default.single("image"), carService_1.default.addCar);
router.delete('/:id', carService_1.default.deleteCarById);
router.patch('/:id', carService_1.default.updateCarById);
exports.default = router;
