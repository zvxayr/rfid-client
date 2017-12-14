const serialport = require('serialport')
const request    = require('./lib/request')

void async function() {
    let portInfo = (await serialport.list())[0]

    const parser = new serialport.parsers.Readline('\n')

    const serial = new serialport(portInfo.comName, {
        baudRate: 9600
    })

    serial.pipe(parser)

    parser.on('data', async data => {
        try {
            await request.post('http://localhost:8000/', { body: data } )
            console.log('Sent: %s', data)
        } catch(e) {
            console.log('Error sending!')
        }
    })
}().catch(console.log)