"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { v2: cloudinary } = require('cloudinary');
cloudinary.config({
    cloud_name: 'djbmetftv',
    api_key: '559115237257721',
    api_secret: 'PbrmSOmGRLZS51VPefbUzpJlsGc',
});
exports.default = cloudinary;
