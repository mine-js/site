import * as express from 'express'
import render from '../utils/renderer'

export default {
    method: 'get',
    route: '/addon/upload',
    execute: async (req: express.Request, res: express.Response) => {
        if(!req.session.userId) {
            res.send('<script>alert("Log-in to upload your addon!"); history.back()</script>')
            return
        }

        render(req, res, 'addon_upload', {})
    }
}