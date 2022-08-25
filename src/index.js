import _ from 'lodash'
import express from "express";
import api from './api/index.js';
import mongooseInit from './services/db/mongoose.js'

await mongooseInit();

const app = express();
import cors from "cors";

app.use(
    cors({
        origin: ['http://localhost:3000', 'https://donaking-0.github.io/pwfront/', 'https://donaking-0.github.io']
    })
)

app.use(express.json());

app.use(api)

app.listen(process.env.PORT || 3000, function () {
    console.log(
        "The server has started on port "+ process.env.PORT +". Head to localhost:"+ process.env.PORT +" in the browser and see what's there!"
    );
});