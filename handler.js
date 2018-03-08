'use strict';

const http = require('http')
const ddb = require('./dynamodb-connect').connect()

const TIMESTAMP = new Date().toISOString()

function zones () {
  return process.env.ZONES
    .split(',')
    .map(zone => zone.trim())
}

function promisedGet (url) {
  return new Promise((resolve, reject) => {
    http.get(url, response => {
      let data = ''

      response.on('data', chunk => data += chunk)
      response.on('end', () => resolve(data))
    })
      .on('error', error => reject(error))
  })
}

function formattedDetails (details) {
  return {
    time: TIMESTAMP,
    area: details.area,
    count: parseInt(details.count),
    target: parseInt(details.target),
    orders: parseInt(details.orders),
    needed: parseInt(details.needed),
    status: details.status,
  }
}

module.exports.check = (event, context, callback) => {
  promisedGet('http://www.golightspeed.com/signup/crowdsource.php')
    .then(data => {
      const zonePromises = zones().map(zone => {
        const statusRegexp = new RegExp(
          'http://www.golightspeed.com/signup/json.php\\?sa=' +
          zone +
          '&orders=\\d+&status=[^\']*', "gm"
        )
        const url = data.match(statusRegexp)[0]

        return promisedGet(url)
      })

      return Promise.all(zonePromises)
    })
    .then(results => {
      const storePromises = results.map(result => {
        const data = JSON.parse(result).features[0].properties

        const params = {
          TableName: process.env.LIGHTSPEED_TABLE,
          Item: formattedDetails(data),
        }

        return ddb.put(params).promise()
      })

      return Promise.all(storePromises)
    })
    .then(data => {
      callback(null, { success: true })
    })
    .catch(error => callback(error))
}
