import * as express from 'express'
import * as mysql from 'mysql2/promise'
import { uploadJar } from '../utils/multerUtils'
import * as fs from 'fs/promises'

export default {
    method: 'get',
    route: '/addon/releases/delete/:addonId/:addonCreator/:version',
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
                const addr = rows2[0].address
                await connection.query('DELETE FROM releases WHERE version=? AND id=?', [req.params.version, req.params.addonId])
                
                const raw3 = await connection.query('SELECT * FROM releases WHERE id=? ORDER BY created DESC LIMIT 1', [req.params.addonId])
                const rows3 = raw3[0] as any[]

                if(rows3.length > 0) {
                    await connection.query('UPDATE addons SET latest=? WHERE id=?', [rows3[0].version, req.params.addonId])
                } else {
                    await connection.query('UPDATE addons SET latest="None" WHERE id=?', [req.params.addonId])
                }

                res.redirect('/addon/releases/' + req.params.addonId)
                if(addr) {
                    await fs.unlink('./static' + addr)
                }
            }
        }
    }
}