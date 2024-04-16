require("./settings.js")
const { default: makeWASocket, useMultiFileAuthState, initInMemoryStore, makeInMemoryStore } = require('@whiskeysockets/baileys')
const pino = require('pino')

const pairing = process.argv.includes('--pairing')
console.log('pairing')

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

async function waen() {
  const auth = await useMultiFileAuthState('sessions')
  const connectionUpdate {
    printQRInTerminal: !pairing,
    browser: ['Mac OS', 'Safari', '10.15.7'],
    auth: auth.state,
    logger: pino({ level: 'silent' })
  }
  const w = makeWASocket(connectionUpdate)
  store.bind(w.ev)   
  setInterval(() => {
      store.writeToFile("./database.json")
  }, 10000)
  if(pairing && !socket.authState.creds.registered) {
    const question = (pertanyaan) => new Promise((resolve, {
      const readLine = require('readLine').createInterface({ input: process.stdin, output: process.stdout })
      readLine.question(pertanyaan, (answer) => {
       resolve(answer)
       readLine.close()
      })
    })
    const nomorWA = await question('Masukan nomor whatsapp anda, Example: 628xx')
    setTimeout(async function() {
        const pairingCode = await socket.requestPairingCode(nomorWA)
        console.log('Pairing code anda adalah :', pairingCode)
      }, 3000)
  }
  socket.ev.on('creds.update', auth.saveCreds)
  socket.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') {
      console.log('Bot By Waen Aktif')
    }
    if (connection === 'close') {
      waen()
    }
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
