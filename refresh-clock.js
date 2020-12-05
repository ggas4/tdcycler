module.exports = (lcd, config) => {

    const fetch = require('node-fetch')

    const printTime = (h, m, s) => {
        if (s % 2 == 0) lcd.cursor(0, 11).print(`${h}:${m}`)
        else lcd.cursor(0, 11).print(`${h} ${m}`)
    }

    const refreshTime = () => {
        fetch('https://api.td2.info.pl:9640/?method=getTimestamp').then(res => res.json())
            .then((json) => {
                var time = new Date(json.message)
                h = time.getHours()
                m = time.getMinutes()
                s = time.getSeconds()

                if (h < 10) h = '0' + h
                if (m < 10) m = '0' + m

                printTime(h, m, s)
            })
    }

    const SWDR = 1, PC = 2
    let h, m, s
    var hole = false, ticks = 0

    switch (config.clock) {
        case SWDR:

            refreshTime()

            setInterval(() => {
                if (hole) {
                    lcd.cursor(0, 13).print(' ')
                    hole = false
                }
                else {
                    lcd.cursor(0, 13).print(':')
                    hole = true
                }
                ticks++

                if (ticks == 30) {
                    refreshTime()
                    ticks = 0
                }
            }, 1000);

            break
        case PC:
            var time = new Date()
            h = time.getHours()
            m = time.getMinutes()
            s = time.getSeconds()

            if (h < 10) h = '0' + h
            if (m < 10) m = '0' + m

            printTime(h, m, s)
            setInterval(() => {
                var time = new Date()
                h = time.getHours()
                m = time.getMinutes()
                s = time.getSeconds()

                if (h < 10) h = '0' + h
                if (m < 10) m = '0' + m

                printTime(h, m, s)
            }, 1000)

            break
    }

}