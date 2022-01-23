import * as express from 'express'
import { Connection } from 'mysql2/promise'

// Get latest
export default {
    method: 'get',
    route: '/api/download/:addonId/:version',
    execute: async (req: express.Request, res: express.Response, connection: Connection) => {
        const rows = (await connection.query('SELECT * FROM releases WHERE id=? AND version=? AND address IS NOT NULL', [req.params.addonId, req.params.version]))[0] as any[]

        if(rows.length > 0) {
            res.redirect(rows[0].address)
        } else {
            res.json({
                error: 'addon_not_found'
            })
        }
    }
}