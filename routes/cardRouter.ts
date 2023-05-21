const express = require('express');

function routes(CardModel: any){
    const cardRouter = express.Router();

    cardRouter.route('/cards').get();

    cardRouter.route('/cards/:id').get();

    cardRouter.route('/packs/:set').get();

    cardRouter.route('/sets').get();
}