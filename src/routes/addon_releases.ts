import * as express from 'express'
import * as mysql from 'mysql2/promise'
import render from '../utils/renderer'
import * as moment from 'moment'
import { xss } from '../utils/utils'
import * as showdown from 'showdown'

export default {
    method: 'get',
    route: '/addon/releases/:addonId',
    execute: async (req: express.Request, res: express.Response, connection: mysql.Connection) => {

        const raw = await connection.query('SELECT * FROM addons WHERE id=?', [req.params.addonId])
        const rows = raw[0] as any[]

        if(rows.length > 0) {
            const releaseRaw = await connection.query('SELECT * FROM releases WHERE id=? ORDER BY created DESC', [req.params.addonId])
            const releasesRowRaw = releaseRaw[0] as any[]
            const releases = new Array()
            const addon = rows[0]

            releasesRowRaw.forEach((elem) => {
                releases.push({
                    ...elem,
                    formattedTime: moment(elem.created as Date).format('YYYY-MM-DD'),
                    formattedUpdates: new showdown.Converter().makeHtml(xss(elem.updates))
                })
            })

            render(req, res, 'release_list', {
                ...addon,
                releases: releases
            })
        }
    }
}