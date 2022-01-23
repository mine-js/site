import * as express from 'express'
import { Connection } from 'mysql2/promise'
import render from '../utils/renderer'

export default {
    method: 'get',
    route: '/addon',
    execute: async (req: express.Request, res: express.Response, connection: Connection) => {
        const result = await connection.query('SELECT id, name, latest FROM addons')

        //console.log(JSON.parse(JSON.stringify(result[0])))

        render(req, res, 'addon_list', {
            addons: result[0]
        })
    }
}