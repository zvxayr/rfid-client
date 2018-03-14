const serialport = require('serialport')
const io = require('socket.io-client')

// replace address with the legit one later
const socket = io('http://localhost:8080')

void async function() {
    let portInfo = (await serialport.list())[0]

    console.log(portInfo)

    const parser = new serialport.parsers.Readline('\n')

    const serial = new serialport(portInfo.comName, {
        baudRate: 9600
    })

    serial.pipe(parser)

    parser.on('data', async data => {
        data = data.trim()
        socket.emit('card read', data)
    })

    socket.on('accept', async data => {
        serial.write('1\n')
    })

    socket.on('reject', async data => {
        serial.write('2\n')
    })
}().catch(console.log)