"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarsModel = void 0;
const objection_1 = require("objection");
class CarsModel extends objection_1.Model {
    static get tableName() {
        return 'cars';
    }
}
exports.CarsModel = CarsModel;
