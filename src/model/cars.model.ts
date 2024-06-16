import {Model, ModelObject} from 'objection';

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
}

export type Cars = ModelObject<CarsModel>;