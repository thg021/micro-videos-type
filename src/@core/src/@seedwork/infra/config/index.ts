import { config as readEnv } from 'dotenv'
import { join } from 'path'

export type Config = {
    db: {
        vendor: any
        host: string
        logging: boolean
    }
}

function makeConfig(envFile): Config {
    const { DB_VENDOR, DB_HOST, DB_LOGGING } = readEnv({ path: envFile }).parsed

    return {
        db: {
            vendor: DB_VENDOR as any,
            host: DB_HOST,
            logging: DB_LOGGING === 'true',
        },
    }
}

const envTestingFile = join(__dirname, '../../../../.env.testing')
export const config = makeConfig(envTestingFile)
