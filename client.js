const serialport = require('serialport')
const io = require('socket.io-client')

// replace address with the legit one later
const socket = io('http://localhost:8080')

socket.on('accept', (data) => {
	// Card accepted
})

socket.on('reject', (data) => {
	// Card rejected
})

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
}().catch(console.log)