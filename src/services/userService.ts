import { createClient } from 'redis';
import { Request, Response } from 'express';
import knex from 'knex';
import { Model } from 'objection';
import { UsersModel } from '../model/users.model';

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

const getUsers = async (req: Request, res: Response): Promise<void> => {
    const getData = 'getData' as string;
    try {
        const usersData = await client.get(getData)
        if (usersData)
            res.status(200).send({ message: "Sucess from cache", data: JSON.parse(usersData) })
        else {
            const response = await UsersModel.query().withGraphFetched('orders');
            client.setEx(getData, 600, JSON.stringify(response))

            res.status(200).send({ message: "Success from DB", data: response })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Internal Server Error' })
    }
}

const getUsersById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const redisUserId = id + 100
        const userDataById = await client.get(redisUserId)
        if (userDataById)
            res.status(200).send({ message: "Sucess from cache", data: JSON.parse(userDataById) })
        else {
            const response = await UsersModel.query().findById(id);
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

const UserSignIn = async(req: Request, res: Response): Promise<void> => {
    try {
        if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
            res.status(400).send({ message: 'Missing or invalid request body' });
            return;
        }

        const { username, email, password } = req.body;

        const insertedUser = await UsersModel.query().insert({
            username:username,
            email:email,
            password:password,  
        });

        res.status(201).send({ message: 'User added successfully', data: insertedUser });

    } catch (err) {
        console.error('Error adding car:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const deleteUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        res.status(400).send({ message: 'ID is required' });
        return;
    }

    try {
        const response = await UsersModel.query().deleteById(id);

        if (response === 0) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        await client.del(id);

        res.status(200).send({ message: "User deleted successfully" });
    } catch (err) {
        console.error('Error deleting car:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

export default { getUsers, getUsersById, UserSignIn, deleteUserById}