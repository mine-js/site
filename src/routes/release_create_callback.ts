import * as express from 'express'
import * as mysql from 'mysql2/promise'
import render from '../utils/renderer'

export default {
    method: 'post',
    route: '/addon/releases/create/callback/:addonCreator/:addonId',
    execute: async (req: express.Request, res: express.Response, connection: mysql.Connection) => {
        if(req.session.userId != req.params.addonCreator) {
            res.send('<script>alert("Not valid!"); history.back()</script>')
            return
        }

        const raw = await connection.query('SELECT * FROM addons WHERE id=? AND creator=?', [req.params.addonId, req.params.addonCreator])
        const rows = raw[0] as any[]

        const version = req.body.version as string
        const update = req.body.update as string

        if(rows.length > 0 && version && update) {
            if(version.length < 64) {
                await connection.query('INSERT INTO releases ( id, version, created, updates ) VALUES ( ?, ?, NOW(), ? )', [req.params.addonId, version, update])
                await connection.query('UPDATE addons SET latest=? WHERE id=?', [version, req.params.addonId])

                res.redirect(`/addon/releases/upload/${req.params.addonId}/${req.params.addonCreator}/${encodeURIComponent(version)}`)
            } else {
                res.send('<script>alert("Version need to be less than 64"); history.back()</script>')
            }
        }
    }
}