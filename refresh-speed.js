module.exports = (lcd, config) => {

    const getSpeed = () => {
        fetch('https://api.td2.info.pl:9640/?method=getTrainsOnline').then(res => res.json())
            .then((json) => {
                var v = 0

                for (var i = 0; i < json.message.length; i++) {
                    if (json.message[i].trainNo == config.trainno) {
                        v = json.message[i].dataSpeed
                    }
                }

                printSpeed(v)
            })

    }

    const SerialPort = require('serialport')
    const td2 = new SerialPort(config.tdport)
    const fetch = require('node-fetch')
    const printSpeed = (v) => {
        v = new String(v)
        switch (v.length) {
            case 1:
                lcd.cursor(1, 8).print('  ' + v)
                break
            case 2:
                lcd.cursor(1, 8).print(' ' + v)
                break
            case 3:
                lcd.cursor(1, 8).print(v)
                break
        }
        lcd.cursor(1, 11).print(' km/h')
    }

    const SWDR = 1, PC = 2
    var hole = false, ticks = 0

    switch (config.speed) {
        case SWDR:
            getSpeed()
            
            setInterval(() => {
                if (ticks == 10) {
                    getSpeed()
                    ticks = 0
                }

                ticks++

            }, 5000);

            break
        case PC:

            td2.on('readable', () => {
                printSpeed(new String(td2.read()).charCodeAt(0))
            })
            break
    }

}