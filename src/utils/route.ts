import * as express from 'express'
import * as mysql2 from 'mysql2'

export default interface Route {
    method: string,
    route: string,
    multer: any,
    execute: (req: express.Request, res: express.Response, conn: mysql2.Connection) => void
}