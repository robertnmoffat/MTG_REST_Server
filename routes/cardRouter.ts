const express = require('express');

import {HydratedDocument} from 'mongoose';
const CardModel = require('../models/CardModel');
const cardsController = require('../controllers/cardsController.js');

function routes(CardModel: any){
    const cardRouter = express.Router();
    const {getWithId, getWithSet} = cardsController(CardModel);

    //middleware
    cardRouter.use('/cards', (req:Express.Request,res:Express.Response, next:any) => {return next()});

    cardRouter.route('/cards/:set').get(getWithSet);

    cardRouter.route('/cards/:set/:start').get(getWithSet);

    cardRouter.route('/cards/:id').get(getWithSet);

    cardRouter.route('/packs/:set').get();

    cardRouter.route('/sets').get();

    return cardRouter;
}

module.exports = routes;