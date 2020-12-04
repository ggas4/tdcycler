const fetch = require('node-fetch')

const refreshClock = require('./refresh-clock')
const refreshSpeed = require('./refresh-speed')
const refreshRj = require('./refresh-rj')

const showmainscr = (scr, cfg) => {
    scr.clear()

    refreshClock(scr, cfg)
    refreshSpeed(scr, cfg)
    refreshRj(scr, cfg)
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
            scr.cursor(1, 0).print('1. SWDR    ')
            break
        case 2:
            scr.cursor(1, 0).print('2. Komputer')
            break
    }
}

module.exports = (brd, scr, conf) => {
    const J5 = require('johnny-five')
    const SETCLOCK = 0, SETSPEED = 1, MAINVIEW = 2
    var sel = 1, view = SETCLOCK

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
                showmainscr(scr, conf)

                setTimeout(() => {
                    console.log(conf)
                    view = MAINVIEW
                }, 50)
            }
        }, 20)
    })
}