import * as express from 'express'
import * as mysql from 'mysql2/promise'
import { upload } from '../utils/multerUtils'

export default {
    method: 'post',
    route: '/addon/edit/callback/:addonCreator/:addonId',
    execute: async (req: express.Request, res: express.Response, connection: mysql.Connection) => {
        if(req.session.userId != req.params.addonCreator) {
            res.send('<script>alert("Not valid!"); history.back()</script>')
            return
        }

        const raw = await connection.query('SELECT * FROM addons WHERE id=? AND creator=?', [req.params.addonId, req.params.addonCreator])
        const rows = raw[0] as any[]

        const name = req.body.name
        const description = req.body.description

        if(rows.length > 0 && name && description) {
            await connection.query('UPDATE addons SET name=?, description=? WHERE id=?', [name, description, req.params.addonId])

            res.redirect('/addon/info/')
        }
    }
}