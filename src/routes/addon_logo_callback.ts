import * as express from 'express'
import * as mysql from 'mysql2/promise'
import { upload } from '../utils/multerUtils'
import * as fs from 'fs/promises'

export default {
    method: 'post',
    route: '/addon/logo/callback/:addonCreator/:addonId',
    uploader: upload.single('logo'),
    execute: async (req: express.Request, res: express.Response, connection: mysql.Connection) => {
        if(req.session.userId != req.params.addonCreator) {
            res.send('<script>alert("Not valid!"); history.back()</script>')
            return
        }

        const raw = await connection.query('SELECT * FROM addons WHERE id=? AND creator=?', [req.params.addonId, req.params.addonCreator])
        const rows = raw[0] as any[]

        if(rows.length > 0) {

            if(req.file) {

                if(req.file.filename.endsWith('.png') || req.file.filename.endsWith('.jpg') || req.file.filename.endsWith('.jpeg') || req.file.filename.endsWith('.gif')) {

                    await connection.query('UPDATE addons SET image=? WHERE id=?', ['/uploads/' + req.file.filename, req.params.addonId])

                    res.redirect('/addon/info/' + req.params.addonId)

                } else {
                    await fs.unlink('./static/uploads/' + req.file.filename)
                    res.send('<script>alert("You can upload only .png, .jpg, .jpeg, .gif!"); history.back()</script>')
                }
            }

        }
    }
}