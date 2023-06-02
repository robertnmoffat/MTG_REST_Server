const express = require('express');
import { Request, Response, NextFunction } from 'express';
const { Model } = require('mongoose');
const packController = require('../controllers/packController');
const cardsController = require('../controllers/cardsController.js');

function routes(CardModel: typeof Model) {
    const cardRouter = express.Router();
    const { getWithId, getWithSet } = cardsController(CardModel);
    const {handleIncorrectPackRoute, getPackWithSet} = packController(CardModel);

    //middleware
    cardRouter.use('/cards', (req: Request, res: Response, next: NextFunction) => { return next() });

    cardRouter.route('/cards/:set').get(getWithSet);

    cardRouter.route('/cards/:set/:start').get(getWithSet);

    //Specific card with id specified in url query
    cardRouter.route('/cards').get(getWithId);

    cardRouter.route('/packs/:set').get(getPackWithSet);

    cardRouter.route('/packs').get(handleIncorrectPackRoute);

    cardRouter.route('/sets').get();

    return cardRouter;
}

module.exports = routes;