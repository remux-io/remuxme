
'use strict';

const path = require('path');
const jsonfile = require('jsonfile');

const this_module = require('../');
const remux_hls = require('hls-remux.io')

const remux_http_service = remux_hls.remux_http_service;
const hls_playlist = remux_hls.hls_playlist;
const hls_chunk = remux_hls.hls_chunk;
const hls_adapter = remux_hls.hls_adapter;
const hls_application = remux_hls.hls_application;


var default_config_file = path.join(path.parse(process.mainModule.filename).dir, '..', 'config','module.json')
var config = {}

if (process.argv[2]){
  switch (process.argv[2]) {
    case '--file':
      try{
        var configs = jsonfile.readFileSync(path.join(process.argv[3]))
        config = configs.find(function(item){return (item.name === this_module.name)})
        if (!config) config = jsonfile.readFileSync(default_config_file)
      }catch(e){
        console.log(e);
        config = jsonfile.readFileSync(default_config_file)
      }
      break;
    default:
      config = jsonfile.readFileSync(default_config_file)
  }
}else{
  config = jsonfile.readFileSync(default_config_file)
}


var playlist_store = new hls_adapter({
  redis:{
    host:config.settings['redis:host'],
    port:config.settings['redis:port']
  },
  prefix:config.settings['redis:prefix']
})


var http_service = new remux_http_service({
    m3u8_store: playlist_store,
    host:{
      address:config.settings['host:address'],
      port:config.settings['host:port']
    }
})

playlist_store.connect()
