import * as express from 'express'

export default function render(req: express.Request, res: express.Response, name: string, json: any) {
    const jsres = json
    jsres.userId = req.session.userId
    jsres.userName = req.session.userName
    res.render(name, jsres)
}