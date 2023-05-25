const express = require('express');
import { Request, Response, NextFunction } from 'express';
const { Model } = require('mongoose');
const cardsController = require('../controllers/cardsController.js');

function routes(CardModel: typeof Model) {
    const cardRouter = express.Router();
    const { getWithId, getWithSet } = cardsController(CardModel);

    //middleware
    cardRouter.use('/cards', (req: Request, res: Response, next: NextFunction) => { return next() });

    cardRouter.route('/cards/:set').get(getWithSet);

    cardRouter.route('/cards/:set/:start').get(getWithSet);

    cardRouter.route('/cards/:id').get(getWithSet);

    cardRouter.route('/packs/:set').get();

    cardRouter.route('/sets').get();

    return cardRouter;
}

module.exports = routes;