import dayjs from "dayjs"
import { Client, IntentsBitField } from "discord.js"
import { appendFile, mkdir, stat } from 'fs/promises'
import { resolve } from 'path'

export class DiscordClient {
    private static _instance: DiscordClient
    private _client: Client

    private _baseLogDirectory: string = resolve('.', 'logs')
    private _logFilePath: string

    private get clientName(): string | undefined {
        return this._client.user?.username
    }

    private constructor() {
        this._client = new Client({
            intents: [
                IntentsBitField.Flags.GuildMessages
            ]
        })
        
        this._client.on('ready', () => this.clientReady())
        // this._client.on('warn', (log) => this.addLogs(log))
        // this._client.on('error', (log) => this.addLogs(log))

        const logFilename = `logs_${dayjs().get('year')}${dayjs().get('month')+1}${dayjs().get('days')}-${dayjs().get('hours')}${dayjs().get('minutes')}${dayjs().get('seconds')}.log`
        this._logFilePath = resolve(this._baseLogDirectory, logFilename)
        DiscordClient._instance = this
    }

    static getInstance(): DiscordClient {
        if (DiscordClient._instance) {
            return DiscordClient._instance
        } else {
            return new DiscordClient()
        }
    }

    async initialize(clientToken: string) {
        await this._client.login(clientToken)
    }

    private async clientReady() {
        await this.addLogs(`${this.clientName} connected`)
    }

    private async addLogs(log: Error | string) {
        console.log(log)

        try {
            await stat(this._baseLogDirectory) 
        } catch (error) {
            if ((error as any).code === 'ENOENT') {
                await mkdir(this._baseLogDirectory)
            }
        }

        const formattedLog: string = `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ${(log instanceof Error) ? log.toString() : log}`

        await appendFile(this._logFilePath, formattedLog)
    }
}