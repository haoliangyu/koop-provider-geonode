
const packageInfo = require('../package.json')

const provider = {
  type: 'provider',
  name: 'geonode',
  version: packageInfo.version,
  hosts: true,
  disableIdParam: false,
  Model: require('./model')
}

module.exports = provider
