# koop-provider-geonode

An experimental Koop provider for [GeoNode](https://geonode.org/)

## Installation

With [npm](https://www.npmjs.com/)

``` bash
npm install koop-provider-geonode
```

With [Koop CLI](https://github.com/koopjs/koop-cli)

``` bash
koop add provider koop-provider-geonode
```

## How to use

This provider uses the `host` and `id` parameter in its request, for example,

```
/geonode/rest/services/:host/:id/FeatureServer/0
```

The `host` parameter is the name of the target GeoNode service. This can be configured in the Koop app configuration (usually in `config/*.json`)

``` javascript
{
  // all configuration for this provider must be in the "geonodeProvider" namespace
  "geonodeProvider": {
    "hosts": {
      // this is the host name you would use in the Koop request URL
      "themimu": {
        // REQUIRED the GeoNode service URL
        "url": "http://geonode.themimu.info",
        // OPTIONAL the ID field for the feature
        "idField": "OBJECTID"
      }
    }
  }
}
```

The `id` parameter is the dataset id from the GeoNode. This can be found in the URL of a GeoNode layer. For example,

```
http://geonode.themimu.info/layers/geonode:amyotha_hluttaw_2020
```

is the URL for the layer `geonode:amyotha_hluttaw_2020` in the service.

Therefore, this layer can be read from the Koop request URL

```
/geonode/rest/services/themimu/geonode:amyotha_hluttaw_2020/FeatureServer/0
```

## How it works

The provider utilizes the GeoNode [WFS GeoJSON ouput](https://docs.geoserver.org/latest/en/user/services/wfs/outputformats.html#json-and-jsonp-output) to get the layer data and the [GeoNode REST API](https://geonode-docs.readthedocs.io/en/latest/reference/api.html) to get the layer metadata.

## License

MIT