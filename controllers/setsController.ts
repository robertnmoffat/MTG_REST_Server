import {setNames} from '../data/supportedSets'
import {Request, Response} from 'express'

/**
 * Handles requests for set data
 * @returns Functions to handle mtg set requests
 */
function setsController(){

    /**
     * Returns all set abbreviations used in this database
     * @param req HTTP request
     * @param res HTTP response
     */
    function getSets(req: Request, res: Response){
        res.send(setNames);
    }

    return {getSets};
}

module.exports = setsController;