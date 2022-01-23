import * as express from 'express'
import * as mysql from 'mysql2/promise'

export default {
    method: 'post',
    route: '/addon/callback',
    execute: async (req: express.Request, res: express.Response, connection: mysql.Connection) => {
        if(!req.session.userId) {
            res.send('<script>alert("Log-in to upload your addon!"); history.back()</script>')
            return
        }

        const id = req.body.id as string
        const name = req.body.name as string
        const description = req.body.description as string
        if(id && name && description) {
            if(id.match(/^[A-Za-z\d_-]+$/) && id.length < 64 && name.length < 64) {
                try {
                    await connection.query('INSERT INTO addons (id, creator, name, description) VALUES (?, ?, ?, ?)', [id, req.session.userId, name, description])
                    res.redirect('/addon/info/' + id)
                } catch {
                    res.send('<script>alert("the ID duplicates!"); history.back()</script>')
                }
            } else {
                res.send('<script>alert("ID and Name need to be less than 64"); history.back()</script>')
            }
        }
    }
}