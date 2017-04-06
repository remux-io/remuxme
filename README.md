# remuxme (production beta)
Ffmpeg process manager
(cli and graphql)


[![asciicast](https://asciinema.org/a/111578.png)](https://asciinema.org/a/111578)


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
- nodejs api


### start cli
```
$ remux
```
non global
```
$ [remuxmeHome]/bin/remux
```

### config information
on first start remux make `~/.remux.io/` folder and put all configuration files there.
to edit demo ffmped process or add new please look `~/.remux.io/processes.json`
(also the feature to change ffmpeg params and add new process from cli is in road map )


### video tutorials

ffmpeg stream log
[![asciicast](https://asciinema.org/a/111579.png)](https://asciinema.org/a/111579)

manage remote remux node
[![asciicast](https://asciinema.org/a/111586.png)](https://asciinema.org/a/111586)

config processes and taskset
[![asciicast](https://asciinema.org/a/111595.png)](https://asciinema.org/a/111595)

remote remux node config change
[![asciicast](https://asciinema.org/a/111600.png)](https://asciinema.org/a/111600)


### screen-shots

graphql
![remuxcli](https://raw.githubusercontent.com/remux-io/remuxme/master/img/graphql.png "remux graphql")


### road map
  - ffmpeg process add / remove from cli
  - ffmpeg process params edit from cli
  - ffmpeg process template configuration
  - modules integration
  - user manual
  - api documentation


### help
```
Commands:

    help [command...]                                  Provides help for a given command.
    exit                                               Exits application.
    list [options]                                     List remux processes.
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
