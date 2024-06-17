import {Model, ModelObject} from 'objection';
import { CarsModel } from './cars.model';
import { UsersModel } from './users.model';

export class OrdersModel extends Model {
    id!:number;
    user_id!:string;
    car_id!:string;

    static get tableName(){
        return 'orders';
    }

    static get relationMappings(){
        return {
            cars: {
                relation:Model.BelongsToOneRelation,
                modelClass:CarsModel,
                join:{
                    from:'orders.car_id',
                    to:'cars.id',
                }
            },
            users: {
                relation:Model.BelongsToOneRelation,
                modelClass:UsersModel,
                join:{
                    from:'orders.user_id',
                    to:'users.id',
                }
            }
        }
    }
}

export type Cars = ModelObject<OrdersModel>;