const fetch = require('node-fetch')
const Clock = require('./refresh-clock')
const Speed = require('./refresh-speed')
const Rj = require('./refresh-rj')
const showmainmenu = require('./main-menu')
const SETCLOCK = 0, SETSPEED = 1, MAINVIEW = 2, MAINMENU = 3
const SerialPort = require('serialport')
const SWDR = 1, PC = 2

let view, hole = false, ticks = {
    clock: 0,
    speed: 0
}

const refreshRj = (lcd, conf) => {
    fetch('https://api.td2.info.pl:9640/?method=getTrainsOnline').then(r => r.json())
        .then((api) => {
            for (var i = 0; i < api.message.length; i++) {

                if (typeof api.message[i].region != 'undefined') Rj.refreshRjData(lcd, conf, api.message[i].region)

                setInterval(() => {
                    if (typeof api.message[i].region != 'undefined') Rj.refreshRjData(lcd, conf, api.message[i].region)
                }, 30000)
            }
        })
}

const refreshClock = (lcd, config) => {
    switch (config.clock) {
        case SWDR:

            if (view == MAINVIEW) Clock.getSwdrTime(lcd)

            setInterval(() => {
                if (hole) lcd.cursor(0, 13).print(' ')
                else lcd.cursor(0, 13).print(':')
                hole = !hole
                ticks.clock++

                if (ticks.clock == 10) {
                    if (view == MAINVIEW) Clock.getSwdrTime(lcd)
                    ticks.clock = 0
                }
            }, 1000);

            break
        case PC:
            if (view == MAINVIEW) Clock.getComputerTime(lcd)
            setInterval(() => {
                if (view == MAINVIEW) Clock.getComputerTime(lcd)
            }, 1000)

            break
    }
}

const refreshSpeed = (lcd, config, td2) => {
    switch (config.speed) {
        case SWDR:
            Speed.getSpeed(lcd, config)

            setInterval(() => {
                Speed.getSpeed(lcd, config)
                ticks.speed = 0

                ticks.speed++
            }, 5000);

            break
        case PC:

            td2.on('readable', () => {
                printSpeed(new String(td2.read()).charCodeAt(0))
            })
            break
    }
}

const showmainscr = (scr, cfg, prt) => {
    if (view == MAINVIEW) {
        scr.clear()

        refreshClock(scr, cfg)
        refreshSpeed(scr, cfg, prt)
        refreshRj(scr, cfg)
    }
}

const selectClock = (sel, scr) => {
    switch (sel) {
        case 1:
            scr.cursor(1, 0).print(`${sel}. SWDR    `)
            break
        case 2:
            scr.cursor(1, 0).print(`${sel}. Komputer`)
            break
    }
}

const selectSpeedometer = (sel, scr) => {
    switch (sel) {
        case 1:
            scr.cursor(1, 0).print(`${sel}. SWDR    `)
            break
        case 2:
            scr.cursor(1, 0).print(`${sel}. Komputer`)
            break
    }
}

module.exports = (brd, scr, conf) => {
    const J5 = require('johnny-five')
    const TD2 = new SerialPort(conf.tdport)

    var sel = 1
    view = SETCLOCK

    scr.clear()
    const F1 = new J5.Button({
        pin: 12,
        isPullup: true
    })
    const F2 = new J5.Button({
        pin: 11,
        isPullup: true
    })

    scr.print('Wybierz zegar')
    selectClock(sel, scr)

    F1.on('press', () => {
        setTimeout(() => {
            if (view == SETCLOCK) {
                if (sel < 2) sel++
                else sel = 1
                selectClock(sel, scr)
            }

            if (view == SETSPEED) {
                if (sel < 2) sel++
                else sel = 1
                selectSpeedometer(sel, scr)
            }
        }, 20)
    })

    F2.on('press', () => {
        setTimeout(() => {
            if (view == SETCLOCK) {
                conf.clock = sel
                sel = 1

                scr.clear()
                scr.print('Wybierz pr-mierz')
                selectSpeedometer(sel, scr)
                setTimeout(() => {
                    view = SETSPEED
                }, 50)
            }

            if (view == SETSPEED) {
                conf.speed = sel

                setTimeout(() => {
                    console.log(conf)
                    view = MAINVIEW
                    showmainscr(scr, conf, TD2)
                }, 50)
            }
        }, 20)
    })
}