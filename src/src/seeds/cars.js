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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        // Deletes ALL existing entries
        yield knex('cars').del();
        // Inserts seed entries
        yield knex('cars').insert([
            { id: 1, name: "Car1", price: 15000, start_rent: new Date('2024-06-01T10:00:00Z'), finish_rent: new Date('2024-06-10T10:00:00Z') },
            { id: 2, name: "Car2", price: 20000, start_rent: new Date('2024-07-01T10:00:00Z'), finish_rent: new Date('2024-07-10T10:00:00Z') },
            { id: 3, name: "Car3", price: 25000, start_rent: new Date('2024-08-01T10:00:00Z'), finish_rent: new Date('2024-08-10T10:00:00Z') }
        ]);
    });
}
exports.seed = seed;
