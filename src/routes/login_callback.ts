import * as express from 'express'
import * as axios from 'axios'
import * as config from '../../config.json'

export default {
    method: 'get',
    route: '/callback',
    execute: async (req: express.Request, res: express.Response) => {
        if(req.query['code']) {
            const accessTokenRes = await axios.default.post('https://github.com/login/oauth/access_token', {
                client_id: config.gh_client,
                client_secret: config.gh_secret,
                code: req.query['code'],
                redirect_uri: config.gh_redirect
            }, {
                headers: {
                    Accept: 'application/json'
                }
            })
            if(accessTokenRes.data) {
                const token = accessTokenRes.data.access_token
                if(token) {
                    const profileRes = await axios.default.get('https://api.github.com/user', {
                        headers: {
                            Accept: 'application/vnd.github.v3+json',
                            Authorization: 'token ' + token
                        }
                    })
                    const profile = profileRes.data

                    req.session.userId = profile.id
                    req.session.userName = profile.name
                    req.session.save()

                    res.redirect('/')
                } else {
                    res.send('<script>alert("Error occured! ' + accessTokenRes.data.error + '"); location.href = "/";</script>')
                }
            }
        }
    }
}