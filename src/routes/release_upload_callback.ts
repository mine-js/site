import * as express from 'express'
import * as mysql from 'mysql2/promise'
import { uploadJar } from '../utils/multerUtils'
import * as fs from 'fs/promises'

export default {
    method: 'post',
    uploader: uploadJar.single('jar'),
    route: '/addon/releases/upload/callback/:addonCreator/:addonId/:version',
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

            if(rows2.length > 0 && req.file) {
                if(req.file.filename.endsWith('.jar')) {

                    await connection.query('UPDATE releases SET address=? WHERE id=?', ['/uploads/' + req.file.filename, req.params.addonId])

                    res.redirect('/addon/releases/' + req.params.addonId)

                } else {
                    await fs.unlink('./static/uploads/' + req.file.filename)
                    res.send('<script>alert("You can upload only .jar!"); history.back()</script>')
                }
            }
        }
    }
}