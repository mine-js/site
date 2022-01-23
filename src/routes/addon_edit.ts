import * as express from 'express'
import * as mysql from 'mysql2/promise'
import render from '../utils/renderer'

export default {
    method: 'get',
    route: '/addon/edit/:addonId/:addonCreator',
    execute: async (req: express.Request, res: express.Response, connection: mysql.Connection) => {
        if(req.session.userId != req.params.addonCreator) {
            res.send('<script>alert("Not valid!"); history.back()</script>')
            return
        }

        const raw = await connection.query('SELECT * FROM addons WHERE id=? AND creator=?', [req.params.addonId, req.params.addonCreator])
        const rows = raw[0] as any[]

        if(rows.length > 0) {
            render(req, res, 'addon_edit', rows[0])
        }
    }
}