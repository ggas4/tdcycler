module.exports = {

    printTime: (h, m, s, lcd) => {
        if (s % 2 == 0) lcd.cursor(0, 11).print(`${h}:${m}`)
        else lcd.cursor(0, 11).print(`${h} ${m}`)
    },

    getSwdrTime: (scr) => {
        const printTime = (h, m, s, lcd) => {
            if (s % 2 == 0) lcd.cursor(0, 11).print(`${h}:${m}`)
            else lcd.cursor(0, 11).print(`${h} ${m}`)
        }
        const fetch = require('node-fetch')
        fetch('https://api.td2.info.pl:9640/?method=getTimestamp').then(res => res.json())
            .then((json) => {
                var time = new Date(json.message)
                h = time.getHours()
                m = time.getMinutes()
                s = time.getSeconds()

                if (h < 10) h = '0' + h
                if (m < 10) m = '0' + m

                printTime(h, m, s, scr)
            })
    },

    getComputerTime: (lcd) => {
        const printTime = (h, m, s, lcd) => {
            if (s % 2 == 0) lcd.cursor(0, 11).print(`${h}:${m}`)
            else lcd.cursor(0, 11).print(`${h} ${m}`)
        }
        var time = new Date()
        h = time.getHours()
        m = time.getMinutes()
        s = time.getSeconds()

        if (h < 10) h = '0' + h
        if (m < 10) m = '0' + m

        printTime(h, m, s, lcd)

    },

    SWDR: 1,
    PC: 2

}