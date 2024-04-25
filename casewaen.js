module.exports = async(w, msg, store) => {
   const type = Object.keys(msg.message)[0]
   const body = type === "conversation" ? msg.message.conversation : type === "extendedTextMessage" ? msg.message.extendedTextMessage.text : type === "imageMessage" ? msg.message.imageMessage.caption : type === "videoMessage" ? msg.message.videoMessage.caption : ''
   const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '.'
   const isCmd = body.startsWith(prefix)
   const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
   const from = msg.key.remoteJid
  
if (isCmd) {
  console.log(require("chalk").black(require("chalk").bgGreen(`Command ${prefix + command} `)), require("chalk").black(require("chalk").bgWhite(`Dari ${msg.pushName}`)))
}

const reply = (teks) => {
  w.sendMessage(from, { text: teks }, { quoted: msg })
}

switch (command) {
   case "tes": {
     reply("On Kak!!!")
  }
   break
}
}