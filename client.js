const serialport = require('serialport')
const io = require('socket.io-client')

// replace address with the legit one later
const socket = io('http://localhost:8080')

/*
    Features needed:
    Offine Support
    Disconnect/Reconnect Logic
    Data Validation
*/

// socket.on('connect', function() {});
// socket.on('event', function(data) {});
// socket.on('disconnect', function() {});

// void async function() {
//     let portInfo = (await serialport.list())[0]

//     console.log(portInfo)

//     const parser = new serialport.parsers.Readline('\n')

//     const serial = new serialport(portInfo.comName, {
//         baudRate: 9600
//     })

//     serial.pipe(parser)

//     parser.on('data', async data => {
//         data = data.trim()

//         axios.post('http://localhost:8000', { data })
//             .then(response => {
//                 console.log(response.data)
//             })
//             .catch(console.error)
//     })
// }().catch(console.log)