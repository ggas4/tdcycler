module.exports = (lcd, config) => {

    const refreshRjData = () => {
        fetch(`https://api.td2.info.pl:9640/?method=readFromSWDR&value=getTimetable;${config.trainno};eu`).then(res => res.json())
            .then((api) => {
                if (api.message.trainInfo != null) dispStation(api.message)
                else {
                    lcd.cursor(0, 0).print('RJ (!)')
                    lcd.cursor(1, 0).print('0')
                }
            })
    }

    const dispStation = (rj) => {
        const destination = rj.trainInfo.route.split('|')[1]
        var result, ticks, rjLg = rj.stopPoints.length
        if (destination.length > 10) {
            result = destination.substr(0, 7) + '...'
        } else {
            result = destination
        }
        lcd.cursor(0, 0).print(result)
        var delay = rj.stopPoints[rjLg - 1].departureDelay
        if (delay > 0) {
            delay = '+' + delay
        }

        lcd.cursor(1, 0).print(`${delay}   `)
    }
    const fetch = require('node-fetch')

    refreshRjData()

    setInterval(() => {
        refreshRjData()
    }, 30000)
}