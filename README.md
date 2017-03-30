
```
   ____  _____ __  __ _   ___  __  ___ ___
  |  _ \| ____|  \/  | | | \ \/ / |_ _/ _ \
  | |_) |  _| | |\/| | | | |\  /   | | | | |
  |  _ <| |___| |  | | |_| |/  \ _ | | |_| |
  |_| \_\_____|_|  |_|\___//_/\_(_)___\___/
```
# remuxme (beta)
Ffmpeg process manager


![remuxcli](https://raw.githubusercontent.com/remux-io/remuxme/master/img/remuxcli.png "remux cli")


### installation
```
$ npm install https://github.com/remux-io/remuxme.git -g
```
or
```
$ git clone https://github.com/remux-io/remuxme.git
$ cd remuxme
$ npm install
```

### start cli
```
$ remux
```
non global
```
$ [remuxmeHome]/bin/remux
```
### screen-shots

ffmpeg-service start
![remuxcli](https://raw.githubusercontent.com/remux-io/remuxme/master/img/startservice.png "ffmpeg-service")

remux-server configs
![remuxcli](https://raw.githubusercontent.com/remux-io/remuxme/master/img/listofsets.png "envs")

graphql
![remuxcli](https://raw.githubusercontent.com/remux-io/remuxme/master/img/graphql.png "remux graphql")


### road map
  - graphql auth
  - logs streaming
  - manage remote remux-ffmpeg services from client
  - cpu affinity
  - modules integration
  - user manual
  - api documentation


### help
```
Commands:

    help [command...]                    Provides help for a given command.
    exit                                 Exits application.
    list                                 List remux processes.
    start <id>                           Start ffmpeg service.
    stop <id>                            Stop ffmpeg service.
    restart <id>                         Restart ffmpeg service.
    info <id>                            Get full information about ffmpeg service.
    process set <id> [variable] [value]  Set or view ffmpeg-service valiables.
    server start                         Start/Restart Remux server.
    server restart                       Restart Remux server.
    server stop                          Stop Remux server.
    server set [variable] [value]        Set or view Remux valiables.

```


## used modules
  - pm2
  - vorpal
  - chalk
  - cli-table2
  - duration
  - express
  - express-graphql
  - graphql
  - jsonfile
  - request
