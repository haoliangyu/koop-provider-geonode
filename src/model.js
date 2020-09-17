const fetch = require('node-fetch')
const config = require('config')
const NodeCache = require('node-cache')

const metadataCache = new NodeCache({ stdTTL: 600 });

function Model (koop) {}

// each model should have a getData() function to fetch the geo data
// and format it into a geojson
Model.prototype.getData = function (req, callback) {
  const { host, id } = req.params
  const decodedId = decodeURIComponent(id)

  Promise
    .all([
      getGeoJSON(host, decodedId),
      getMetadata(host, decodedId)
    ])
    .then(([geojson, metadata]) => {
      geojson.metadata = metadata
      callback(null, geojson)
    })
    .catch((error) => callback(error))
}

async function getGeoJSON (host, id) {
  const hostUrl = config.get('geonodeProvider.hosts')[host].url

  if (!hostUrl) {
    throw new Error(`The host URL for "${host}" is undefined`)
  }

  const requestUrl = `${hostUrl}/geoserver/wfs?srsName=EPSG:4326&request=GetFeature&typeName=${id}&outputformat=json`
  const response = await fetch(requestUrl)

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json()
}


async function getMetadata (host, id) {
  try {
    if (!metadataCache.has(host)) {
      await setMetadata(host);
    }

    const object = metadataCache.get(host)[id]

    if (!object) {
      return { name: id }
    }

    return object
  } catch (e) {
    return { name: id }
  }
}

async function setMetadata (host) {
  const { url, idField } = config.get('geonodeProvider.hosts')[host]
  const response = await fetch(`${url}/api/base`)
  const result = await response.json()
  const data = result.objects.reduce((collection, object) => {
    const key = decodeURIComponent(object.detail_url.split('/').pop())
    const meta = formatMetadata(object, idField)
    collection[key] = meta

    return collection
  }, {})

  metadataCache.set(host, data)
}

function formatMetadata(object, idField) {
  return {
    name: object.title,
    description: object.abstract,
    idField
  }
}

module.exports = Model
