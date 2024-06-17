import {Model, ModelObject} from 'objection';
import { OrdersModel } from './orders.model';

export class UsersModel extends Model {
    id!:number;
    username!:String;
    email!:String;
    password!:String;
    static get tableName(){
        return 'users';
    }
    
    static get relationMappings(){
        return{
            orders:{
                relation: Model.HasManyRelation,
                modelClass: OrdersModel,
                join:{
                    from:'users.id',
                    to:'orders.user_id'
                }
            }
        }
    }
}

export type Cars = ModelObject<UsersModel>;