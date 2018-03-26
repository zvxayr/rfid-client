const serialport = require('serialport')
const io = require('socket.io-client')

// replace address with the legit one later
const socket = io('http://localhost:8080')
const acceptMap = new Map()

acceptMap.set('0BADB079', true);

void async function() {
    const portInfo = (await serialport.list())[0]
    const parser = new serialport.parsers.Readline('\n')
    const serial = new serialport(portInfo.comName, { baudRate: 9600 })

    serial.pipe(parser)
    parser.on('data', async rawData => {
        let data = rawData.trim()
        let accept = Boolean(acceptMap.get(data))

        serial.write(accept ? 'accept\n' : 'reject\n')
        socket.emit('card read', data)
    })
}().catch(console.log)

