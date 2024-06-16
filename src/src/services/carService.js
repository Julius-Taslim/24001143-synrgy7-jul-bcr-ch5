"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const knex_1 = __importDefault(require("knex"));
const objection_1 = require("objection");
const cars_model_1 = require("../model/cars.model");
const cloudinary_1 = __importDefault(require("../middlewares/cloudinary"));
const knexInstance = (0, knex_1.default)({
    client: 'pg',
    connection: {
        user: 'postgres',
        password: 'julius',
        port: 5432,
        host: '127.0.0.1',
        database: 'db_ch5'
    },
});
objection_1.Model.knex(knexInstance);
const client = (0, redis_1.createClient)({
    url: 'redis://localhost:6379',
    socket: {
        connectTimeout: 5000
    }
});
client.connect().catch(err => console.log(err));
//Testing API
// const getJobs = async (req:Request,res:Response): Promise<void>=>{
//     const searchTerm = req.query.search as string
//     try{
//         const comments = await client.get(searchTerm)
//         if(comments) 
//             res.status(200).send({message:"Success from cache", data:JSON.parse(comments)}) //Jika comments ada di cache (client), langsung hit line ini
//         else{
//             const response = await axios(`https://jsonplaceholder.typicode.com/comments?postId=${searchTerm}`) //jike tidak ada comment, hit API (dummy API) ambil data
//             client.setEx(searchTerm,600,JSON.stringify(response.data)) //Data dari API akan dimasukkan ke cache dengan key searchTerm, timeout 600s.
//             res.status(200).send({message:"Success from API", data:response.data})
//         }   
//     }catch(err){
//         console.log(err)
//         res.status(500).send({message:'Internal Server Error'})
//     }
// }
const getCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getData = 'getData';
    try {
        const carData = yield client.get(getData);
        if (carData)
            res.status(200).send({ message: "Sucess from cache", data: JSON.parse(carData) });
        else {
            const response = yield cars_model_1.CarsModel.query();
            client.setEx(getData, 600, JSON.stringify(response));
            res.status(200).send({ message: "Success from DB", data: response });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
const getCarById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).send({ message: 'ID is required' });
        return;
    }
    try {
        const carDataById = yield client.get(id);
        if (carDataById)
            res.status(200).send({ message: "Sucess from cache", data: JSON.parse(carDataById) });
        else {
            const response = yield cars_model_1.CarsModel.query().findById(id);
            if (!response) {
                res.status(404).send({ message: "Car not found" });
                return;
            }
            client.setEx(id, 600, JSON.stringify(response));
            res.status(200).send({ message: "Success from DB", data: response });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
const addCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        const fileBase64 = req.file.buffer.toString('base64');
        const file = `data:${req.file.mimetype};base64,${fileBase64}`;
        cloudinary_1.default.uploader.upload(file, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Failed to upload to Cloudinary' });
                return;
            }
            req.body.image_url = result.url;
            res.status(200).json({ message: "file uploaded", url: result.url });
        });
        // if (!req.body || !req.body.name || !req.body.price || !req.body.start_rent ||!req.body.image_url|| !req.body.finish_rent) {
        //     res.status(400).send({ message: 'Missing or invalid request body' });
        //     return;
        // }
        // const { name,image_url, price, start_rent, finish_rent } = req.body;
        // const insertedCar = await CarsModel.query().insert({
        //     name: name,
        //     price: price,
        //     image_url: image_url,
        //     start_rent: start_rent,
        //     finish_rent: finish_rent
        // });
        // res.status(201).send({ message: 'Car added successfully', data: insertedCar });
    }
    catch (err) {
        console.error('Error adding car:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
const deleteCarById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).send({ message: 'ID is required' });
        return;
    }
    try {
        const response = yield cars_model_1.CarsModel.query().deleteById(id);
        if (response === 0) {
            res.status(404).send({ message: "Car not found" });
            return;
        }
        yield client.del(id);
        res.status(200).send({ message: "Car deleted successfully" });
    }
    catch (err) {
        console.error('Error deleting car:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
const updateCarById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updates = req.body;
    if (!id) {
        res.status(400).send({ message: 'ID is required' });
        return;
    }
    if (!updates || Object.keys(updates).length === 0) {
        res.status(400).send({ message: 'No updates provided' });
        return;
    }
    try {
        const updatedCar = yield cars_model_1.CarsModel.query().patchAndFetchById(id, updates);
        if (!updatedCar) {
            res.status(404).send({ message: "Car not found" });
            return;
        }
        // Update the cached data for the updated car
        yield client.setEx(id, 600, JSON.stringify(updatedCar));
        res.status(200).send({ message: "Car updated successfully", data: updatedCar });
    }
    catch (err) {
        console.error('Error updating car:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});
exports.default = { getCars, addCar, getCarById, deleteCarById, updateCarById };
