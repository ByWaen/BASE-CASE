/*

BASE CASE SCRIPT BY WAEN
© CREATED BY WAEN

Allah Subhanahu Wa Ta'ala berfirman:

يٰۤاَ يُّهَا الَّذِيْنَ اٰمَنُوْا لِمَ تَقُوْلُوْنَ مَا لَا تَفْعَلُوْنَ
كَبُرَ مَقْتًا عِنْدَ اللّٰهِ اَنْ تَقُوْلُوْا مَا لَا تَفْعَلُوْنَ
yaaa ayyuhallaziina aamanuu lima taquuluuna maa laa
taf'aluun, kaburo maqtan 'ingdallohi ang taquuluu 
maa laa taf'aluun

ARTINYA : "Wahai orang-orang yang beriman! Mengapa 
kamu mengatakan sesuatu yang tidak kamu kerjakan?,
Itu sangatlah dibenci di sisi Allah jika kamu mengatakan 
apa-apa yang tidak kamu kerjakan."
(QS. As-Saff 61: Ayat 2 - 3)

*/

require('./settings.js')
const { default: makeWASocket, useMultiFileAuthState, initInMemoryStore, makeInMemoryStore, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, downloadContentFromMessage, downloadHistory, proto, getMessage, generateWAMessageContent, prepareWAMessageMedia } = require('@whiskeysockets/baileys')
const pino = require('pino')
const readline = require('readline')
const chalk = require('chalk')
const fs = require('fs')

const pairing = process.argv.includes('--pairing')
console.log(chalk.blueBright('Masukan nomor whatsapp anda, Example : 628xx'))

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

async function waen() {
  const auth = await useMultiFileAuthState('sessions')
  const connectionUpdate = {
    printQRInTerminal: !pairing,
    browser: ['Mac OS', 'Safari', '10.15.7'],
    auth: auth.state,
    logger: pino({ level: 'silent'})
  }
  const w = makeWASocket(connectionUpdate)
  store.bind(w.ev)
  setInterval(() => {
    store.writeToFile("./database.json")
  }, 10000)
  if(pairing && !w.authState.creds.registered) {
    const question = (pertanyaan) => new Promise((resolve) => {
      const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout })
      readline.question(pertanyaan, answer => {
        resolve(answer)
        readline.close()
      })
    })
    const nomorWa = await question('Sedang diproses => ')
    setTimeout(async function() {
      const pairingCode = await w.requestPairingCode(nomorWa)
      console.log('Pairing code anda adalah :', pairingCode)
    }, 3000)
  }
  w.ev.on('creds.update', auth.saveCreds)
  w.ev.on('connection.update', ({ connection }) => {
    if(connection === 'open') console.log('Nomor whatsapp yang terhubung :' + w.user.id.split(':')[0])
    if(connection === 'close') waen()
  })
  w.ev.process(async (events) => {
    if (events['messages.upsert']) {
      const upsert = events['messages.upsert']
      for (let msg of upsert.messages) {
        if (!msg.message) {
          return
        }
        if (msg.key.remoteJid === 'status@broadcast') {
          if (msg.message?.protocolMessage) return
          console.log(`Lihat Status ${msg.pushName} ${msg.key.participant.split('@')[0]}`)
          await w.readMessages([msg.key])
          await delay(1000)
          return await w.readMessages([msg.key])
        }
        require("./casewaen")(w, msg, store)
      }
    }
  })
}

waen()