import * as express from 'express'

export default {
    method: 'get',
    route: '/login',
    execute: (req: express.Request, res: express.Response) => {
        res.redirect('https://github.com/login/oauth/authorize?client_id=cc44100f83afa4b9fe0d&scope=read:user')
    }
}