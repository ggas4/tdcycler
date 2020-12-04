const fetch = require('node-fetch')
const SerialPort = require('serialport')
const J5 = require('johnny-five')
const path = require('path')
const fs = require('fs')
const hub = require('./hub')

const config = JSON.parse(fs.readFileSync('config.json'))
const board = new J5.Board({
    port: config.extport
})
board.on('ready', () => {
    const buzzer = new J5.Led({
        pin: 13
    })
    const lcd = new J5.LCD({
        pins: [7, 2, 6, 5, 4, 3],
        cols: 16,
        rows: 2
    })
    lcd.cursor(0, 0).print('Pobieranie')
    lcd.cursor(1, 0).print('danych z SWDR...')
    fetch('https://api.td2.info.pl:9640/?method=getTimestamp').then(res => res.json())
        .then((json) => {
            if (json.success) hub(board, lcd, config)
        })
})