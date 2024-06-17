import { createClient } from 'redis';
import { Request, Response } from 'express';
import knex from 'knex';
import { Model } from 'objection';
import { CarsModel } from '../model/cars.model';
import cloudinary from '../middlewares/cloudinary';
import { UploadApiResponse } from 'cloudinary';

const knexInstance = knex({
    client: 'pg',
    connection: {
        user: 'postgres',
        password: 'julius',
        port: 5432,
        host: '127.0.0.1',
        database: 'db_ch5'
    },
})
Model.knex(knexInstance);

const client = createClient({
    url: 'redis://localhost:6379',
    socket: {
        connectTimeout: 5000
    }
})

client.connect().catch(err => console.log(err))

const getCars = async (req: Request, res: Response): Promise<void> => {
    const getData = 'getData' as string;
    try {
        const carData = await client.get(getData)
        if (carData)
            res.status(200).send({ message: "Sucess from cache", data: JSON.parse(carData) })
        else {
            const response = await CarsModel.query();
            client.setEx(getData, 600, JSON.stringify(response))

            res.status(200).send({ message: "Success from DB", data: response })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' })
    }
}

const getCarById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Number.isNaN(id)) {
        res.status(400).send({ message: 'ID is required' });
        return;
    }
    try {
        const carDataById = await client.get(id)
        if (carDataById)
            res.status(200).send({ message: "Sucess from cache", data: JSON.parse(carDataById) })
        else {
            const response = await CarsModel.query().findById(id);
            if (!response) {
                res.status(404).send({ message: "Car not found" });
                return;
            }
            client.setEx(id, 600, JSON.stringify(response))

            res.status(200).send({ message: "Success from DB", data: response })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' })
    }
}

const addCar = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const fileBase64 = req.file.buffer.toString('base64');
        const file = `data:${req.file.mimetype};base64,${fileBase64}`;

        let image_url: string;
        try {
            const result: UploadApiResponse = await cloudinary.uploader.upload(file)
            image_url = result.url;
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to upload to Cloudinary' });
            return;
        }

        if (!req.body || !req.body.name || !req.body.price || !req.body.start_rent || !req.body.finish_rent) {
            res.status(400).send({ message: 'Missing or invalid request body' });
            return;
        }

        const { name, price, start_rent, finish_rent } = req.body;

        const insertedCar = await CarsModel.query().insert({
            name: name,
            price: price,
            image_url: image_url,
            start_rent: start_rent,
            finish_rent: finish_rent
        });

        res.status(201).send({ message: 'Car added successfully', data: insertedCar });

    } catch (err) {
        console.error('Error adding car:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const deleteCarById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || Number.isNaN(id)) {
        res.status(400).send({ message: 'ID is required' });
        return;
    }

    try {
        const response = await CarsModel.query().deleteById(id);

        if (response === 0) {
            res.status(404).send({ message: "Car not found" });
            return;
        }
        await client.del(id);

        res.status(200).send({ message: "Car deleted successfully" });
    } catch (err) {
        console.error('Error deleting car:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const updateCarById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (req.file) {
        const fileBase64 = req.file.buffer.toString('base64');
        const file = `data:${req.file.mimetype};base64,${fileBase64}`;
        try {
            const result: UploadApiResponse = await cloudinary.uploader.upload(file)
            req.body.image_url = result.url;
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to upload to Cloudinary' });
            return;
        }
    }

    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
        res.status(400).send({ message: 'No updates provided' });
        return;
    }

    try {
        const updatedCar = await CarsModel.query().patchAndFetchById(id, updates);

        if (!updatedCar) {
            res.status(404).send({ message: "Car not found" });
            return;
        }

        // Update the cached data for the updated car
        await client.setEx(id, 600, JSON.stringify(updatedCar));

        res.status(200).send({ message: "Car updated successfully", data: updatedCar });
    } catch (err) {
        console.error('Error updating car:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export default { getCars, addCar, getCarById, deleteCarById, updateCarById }