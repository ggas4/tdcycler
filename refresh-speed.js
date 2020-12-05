module.exports = {

    printSpeed: (v, lcd) => {
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
    },

    getSpeed: (lcd, cnf) => {
        const printSpeed = (v, lcd) => {
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
        const fetch = require('node-fetch')
        fetch('https://api.td2.info.pl:9640/?method=getTrainsOnline').then(res => res.json())
            .then((json) => {
                var v = 0

                for (var i = 0; i < json.message.length; i++) {
                    if (json.message[i].trainNo == cnf.trainno) {
                        v = json.message[i].dataSpeed
                    }
                }

                printSpeed(v, lcd)
            })

    }
}