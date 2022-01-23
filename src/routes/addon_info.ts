import * as express from 'express'
import * as mysql from 'mysql2/promise'
import render from '../utils/renderer'
import * as showdown from 'showdown'
import { xss } from '../utils/utils'

export default {
    method: 'get',
    route: '/addon/info/:addonId',
    execute: async (req: express.Request, res: express.Response, connection: mysql.Connection) => {
        const id = req.params.addonId as string
        const rows = await connection.query('SELECT * FROM addons WHERE id=?', [id])

        const r = rows[0][0]

        if(r) {
            r.markdown = new showdown.Converter().makeHtml(xss(r.description))
            render(req, res, 'addon_info', r)
        } else {
            res.send('<script>alert("Invalid addon!"); history.back()</script>')
        }
    }
}