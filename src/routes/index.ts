import * as express from 'express'
import render from '../utils/renderer'

export default {
    method: 'get',
    route: '/',
    execute: (req: express.Request, res: express.Response) => {
        render(req, res, 'index', {})
    }
}