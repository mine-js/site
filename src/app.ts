import 'dotenv/config'
import * as express from 'express'
import * as fs from 'fs'
import * as session from 'express-session'
import * as mysql from "mysql2/promise"
import * as config from '../config.json'
import * as rateLimit from 'express-rate-limit'

declare module 'express-session' {
    interface SessionData {
        userName: string
        userId: string
    }
}

const port = Number(process.env.PORT) || 3000;

(async function () {
    const app = express()
    app.use(express.urlencoded({ extended: true }))
    const connection = await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.db
    });

    app.use(session({
        cookie: {
            path    : '/',
            httpOnly: true,
            maxAge  : 24*60*60*1000
        },
        secret: 'dbwnelfkbnapdovo',
        resave: false,
        saveUninitialized: true
    }))

    app.use(rateLimit.default({
        windowMs: 1*60*1000,
        max: 100
    }));

    app.set('view engine', 'ejs')
    app.use(express.static('static'))

    const routes = fs.readdirSync('./src/routes')

    for(let i = 0; i < routes.length; i++) {
        const elem = routes[i]
        const raw = await import(`./routes/${elem.replace('.ts', '')}`)
        const module = raw.default
        if(module.method === 'get') {
            if(module.uploader) {
                app.get(module.route, module.uploader, (req, res) => {
                    module.execute(req, res, connection)
                })
            } else {
                app.get(module.route, (req, res) => {
                    module.execute(req, res, connection)
                })
            }
        } else if(module.method === 'post') {
            if(module.uploader) {
                app.post(module.route, module.uploader, (req, res) => {
                    module.execute(req, res, connection)
                })
            } else {
                app.post(module.route, (req, res) => {
                    module.execute(req, res, connection)
                })
            }
        }
    }

    app.listen(port, () => {
        console.log('Listening at: ' + port)
    })
}())
