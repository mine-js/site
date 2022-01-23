import * as express from 'express'
import * as mysql from 'mysql2/promise'
import render from '../utils/renderer'

export default {
    method: 'get',
    route: '/addon/releases/upload/:addonId/:addonCreator/:version',
    execute: async (req: express.Request, res: express.Response, connection: mysql.Connection) => {
        if(req.session.userId != req.params.addonCreator) {
            res.send('<script>alert("Not valid!"); history.back()</script>')
            return
        }

        const raw = await connection.query('SELECT * FROM addons WHERE id=? AND creator=?', [req.params.addonId, req.params.addonCreator])
        const rows = raw[0] as any[]

        if(rows.length > 0) {
            const raw2 = await connection.query('SELECT * FROM releases WHERE id=? AND version=?', [req.params.addonId, req.params.version])
            const rows2 = raw2[0] as any[]
            if(rows2.length > 0) {
                render(req, res, 'release_upload', {
                    addon: rows[0],
                    release: rows2[0]
                })
            }
        }
    }
}