import { createClient } from 'redis';
import { Request, Response } from 'express';
import knex from 'knex';
import { Model } from 'objection';
import { UsersModel } from '../model/users.model';
import { OrdersModel } from '../model/orders.model';

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

const getOrders = async (req: Request, res: Response): Promise<void> => {
    const getOrder = 'getOrder' as string;
    try {
        const ordersData = await client.get(getOrder)
        if (ordersData)
            res.status(200).send({ message: "Sucess from cache", data: JSON.parse(ordersData) })
        else {
            const response = await OrdersModel.query();
            client.setEx(getOrder, 600, JSON.stringify(response))

            res.status(200).send({ message: "Success from DB", data: response })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' })
    }
}

const getOrderById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        res.status(400).send({ message: 'ID is required' });
        return;
    }

    try {
        const redisUserId = id + 100
        const orderDataById = await client.get(redisUserId)
        if (orderDataById)
            res.status(200).send({ message: "Sucess from cache", data: JSON.parse(orderDataById) })
        else {
            const response = await OrdersModel.query().findById(id);
            if (!response) {
                res.status(404).send({ message: "User not found" });
                return; 
            }
            client.setEx(redisUserId, 600, JSON.stringify(response))

            res.status(200).send({ message: "Success from DB", data: response })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' })
    }
}

const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body || !req.body.car_id || !req.body.user_id ) {
            res.status(400).send({ message: 'Missing or invalid request body' });
            return;
        }

        const { car_id, user_id } = req.body;

        const insertedOrder = await OrdersModel.query().insert({
            car_id:car_id,
            user_id:user_id,
        });

        res.status(201).send({ message: 'Order created successfully', data: insertedOrder });

    } catch (err) {
        console.error('Error adding car:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const deleteOrderById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        res.status(400).send({ message: 'ID is required' });
        return;
    }

    try {
        const response = await OrdersModel.query().deleteById(id);

        if (response === 0) {
            res.status(404).send({ message: "Order not found" });
            return;
        }
        await client.del(id);

        res.status(200).send({ message: "Order deleted successfully" });
    } catch (err) {
        console.error('Error deleting car:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const updateOrderById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const redisUserId = 100 + id;
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
        const updatedUser = await OrdersModel.query().patchAndFetchById(id, updates);

        if (!updatedUser) {
            res.status(404).send({ message: "Order not found" });
            return;
        }

        // Update the cached data for the updated car
        await client.setEx(redisUserId, 600, JSON.stringify(updatedUser));

        res.status(200).send({ message: "Order updated successfully", data: updatedUser });
    } catch (err) {
        console.error('Error updating car:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export default { getOrders, getOrderById, createOrder, deleteOrderById}