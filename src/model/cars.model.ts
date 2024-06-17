import {Model, ModelObject} from 'objection';
import { OrdersModel } from './orders.model';

export class CarsModel extends Model {
    id!:number;
    name!:String;
    image_url!:Text;
    price!:number;
    start_rent!:Date;
    finish_rent!:Date;

    static get tableName(){
        return 'cars';
    }

    static get relationMappings(){
        return {
            orders: {
                relation:Model.HasManyRelation,
                modelClass:OrdersModel,
                join:{
                    from:'cars.id',
                    to:'orders.car_id'
                }
            }
        }
    }
}

export type Cars = ModelObject<CarsModel>;