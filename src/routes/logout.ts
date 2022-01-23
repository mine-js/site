import * as express from 'express'

export default {
    method: 'get',
    route: '/logout',
    execute: (req: express.Request, res: express.Response) => {
        req.session.destroy((err) => {
            if(err) {
                console.log(err)
                res.send('Error!')
            } else {
                res.redirect('/')
            }
        })
    }
}