import * as multer from 'multer'
import * as path from 'path'

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'static/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().valueOf() + path.extname(file.originalname))
    }
})

export const upload = multer(
    {
        storage: storage,
        limits: {
            fileSize: 5 * 1024 * 1024
        },
        fileFilter: (req, file, callback) => {
            const ext = path.extname(file.originalname)
            //console.log(ext)
            if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.jiff' && ext !== '.gif') {
                callback(null, false)
            }

            callback(null, true)
        }
    }
)

export const uploadJar = multer(
    {
        storage: storage,
        limits: {
            fileSize: 150 * 1024 * 1024
        },
        fileFilter: (req, file, callback) => {
            const ext = path.extname(file.originalname)
            //console.log(ext)
            if(ext !== '.jar') {
                callback(null, false)
            }

            callback(null, true)
        }
    }
)