import { Request, Response } from "express";
import * as mongoose from 'mongoose';

type ReqQuery = { q: string };//Defining so that req.query can be referenced
type ReqParams = { set: string, start: string };
type SelectedCard = { name: string };

/**
 * Creates an object representing database data to be returned by API
 * @param cards Card array returned from database
 * @param req HTTP Request
 * @param res HTTP Response
 * @returns JSON object representing the card array with HATEOAS links
 */
function createReturnObject(cards: [any], req: Request<ReqParams>, res: Response): any {
    const homeURL = req.protocol + '://' + req.get('host');

    const returnObj = {
        cards: cards,
        links: {
            previous:
                req.params.start ? Number(req.params.start) - 10 > 0 ? // Check if the previous ten will be at zero
                    (`${homeURL}/api/cards/${req.params.set}/${Number(req.params.start) - 10}`)
                    : (`${homeURL}/api/cards/${req.params.set}`)
                    : "",
            next: (`${homeURL}/api/cards/${req.params.set}/${Number(req.params.start) ? Number(req.params.start) + 10 : 10}`)
        }
    }

    return returnObj;
}

/**
 * Controller function for all card requests
 * @param CardModel Mongoose model representing the card collection
 * @returns Functions to be routed to
 */
function cardsController(CardModel: any) {
    function getWithSet(req: Request<ReqParams>, res: Response) {

        //If the url has a start position specified
        if (req.params.start) {

            CardModel.find({ set: req.params.set }, { name: 1, _id: 0 }).skip(req.params.start).limit(10)
                .then((cards: [any]) => {

                    const returnObj = createReturnObject(cards, req, res);

                    res.send(returnObj);
                }).catch((err: any) => { console.log(`Error:${err}`) });
        } else {

            CardModel.find({ set: req.params.set }, { _id: 0, name: 1 }).limit(10)
                .then((cards: [any]) => {

                    const returnObj = createReturnObject(cards, req, res);

                    res.send(returnObj);
                }).catch((err: any) => {
                    console.log(`Db return error:${err}`)
                    res.send('Error');
                });
        }
    }

    function getWithId(req: Request, res: Response) { }

    return { getWithId, getWithSet };
}

module.exports = cardsController;