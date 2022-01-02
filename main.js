"use strict";
const { default: makeWASocket, BufferJSON, initInMemoryKeyStore, DisconnectReason, AnyMessageContent, delay, useSingleFileAuthState } = require("@adiwajshing/baileys-md")
const figlet = require("figlet");
const fs = require("fs");
const P = require('pino')
const ind = require('./help/zak')
const { color, ZakiLog } = require("./lib/color");
let setting = JSON.parse(fs.readFileSync('./config.json'));
let sesion = `./${setting.sessionName}.json`
const { state, saveState } = useSingleFileAuthState(sesion)

const start = async () => {
    //Meng weem
	console.log(color(figlet.textSync('ItsukiBot - MD', {
		font: 'Standard',
		horizontalLayout: 'default',
		vertivalLayout: 'default',
		whitespaceBreak: false
	}), 'cyan'))
	console.log(color('[ Created KiZaKiXD ]'))
    // set level pino ke fatal kalo ga mau nampilin log eror
    const zaki = makeWASocket({ printQRInTerminal: true, logger: P({ level: 'debug' }), auth: state }) 
    zaki.multi = true
    zaki.nopref = true
    zaki.prefa = 'anjing'
    console.log(color('Connected....'))
    zaki.ev.on('messages.upsert', async m => {
    	if (!m.messages) return
        const msg = m.messages[0]
        require('./message/zaki')(zaki, msg, m, ind, setting)
    })

    zaki.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            console.log(ZakiLog('connection closed, try to restart'))
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
            ? start()
            : console.log(ZakiLog('Wa web terlogout.'))
        }
    })

    zaki.ev.on('creds.update', () => saveState)

    return zaki
}

start()
.catch(err => console.log(err))
