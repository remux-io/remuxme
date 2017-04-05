# remuxme (beta)
Ffmpeg process manager
(cli and graphql)


![remuxcli](https://raw.githubusercontent.com/remux-io/remuxme/master/img/remuxcli.png "remux cli")


### installation

```
$ npm install https://github.com/remux-io/remuxme.git -g
```

### features
- ffmpeg as process
- auto restart on fail
- remote ffmpeg processes management
- cpu affinity
- command line
- graphql api
- log streaming


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
  - modules integration
  - user manual
  - api documentation


### help
```
Commands:

    help [command...]                                  Provides help for a given command.
    exit                                               Exits application.
    list                                               List remux processes.
    start <id>                                         Start ffmpeg service.
    stop <id>                                          Stop ffmpeg service.
    restart <id>                                       Restart ffmpeg service.
    info <id>                                          Get full information about ffmpeg service.
    taskset <id> <cpus>                                Change CPU affinity for working process.
    process set <id> [variable] [value]                Set or view ffmpeg-service valiables.
    server start                                       Start/Restart Remux server.
    server restart                                     Restart Remux server.
    server stop                                        Stop Remux server.
    server set [variable] [value]                      Set or view Remux valiables.
    connect local                                      Connect to local server.
    connect host <id>                                  Connect to remote server.
    connect info                                       Info for current Remux host connection.
    host list                                          List of configured remote hosts.
    host settings <id>                                 Get host settings by id.
    host add <name> <ssl> <host> <port> <user> <pass>  Add new host.
    host remove <id>                                   Remove host configuration.
    host set <id> <variable> <value>                   Set host valiable.
    log start <id>                                     Attach to log stream for process.
    log stop <id>                                      Disconnect from log stream for process.
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
