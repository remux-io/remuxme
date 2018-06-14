# remuxme (production beta)
Ffmpeg process manager
(cli and graphql)


[![asciicast](https://asciinema.org/a/111578.png)](https://asciinema.org/a/111578)

---
### installation

```
$ sudo npm install remuxme -g
```

---
### features
- ffmpeg as process
- auto restart on fail
- remote ffmpeg processes management
- cpu affinity
- command line
- graphql api
- log streaming
- nodejs api

---
### start cli
```
$ remux
```
---
### video tutorials

ffmpeg stream log
[![asciicast](https://asciinema.org/a/111579.png)](https://asciinema.org/a/111579)

manage remote remux node
[![asciicast](https://asciinema.org/a/111586.png)](https://asciinema.org/a/111586)

config processes and taskset
[![asciicast](https://asciinema.org/a/111595.png)](https://asciinema.org/a/111595)

remote remux node config change
[![asciicast](https://asciinema.org/a/111600.png)](https://asciinema.org/a/111600)

---
### screen-shots

graphql
![remuxcli](https://raw.githubusercontent.com/remux-io/remuxme/master/img/graphql.png "remux graphql")

---
### road map
  - ffmpeg process add / remove from cli
  - ffmpeg process params edit from cli
  - ffmpeg process template configuration
  - modules integration
  - user manual
  - api documentation

---
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
---
### config information
on first start remux make `~/.remux.io/` folder and put all configuration files there.
to edit demo ffmped process or add new please look `~/.remux.io/processes.json`
(also the feature to change ffmpeg params and add new process from cli is in road map )

##### remux.json /remux server config file/
`host`: ip address.

`port`: port number of remux server.

`debugGraphQL`: If `true`, presents GraphiQL when the GraphQL endpoint is loaded in a browser.

`admin`: user name of server access.

`pass`: password for user.

`ffmpegDefaultPath`: path to default ffmpeg binary.

```
{
  "ssl": "false",
  "host": "0.0.0.0",
  "port": 4000,
  "debugGraphQL": true,
  "admin": "remux",
  "pass": "remuxme",
  "ffmpegDefaultPath": "/usr/bin/ffmpeg"
}
```

##### processes.json /ffmpeg processes configurations/
`name`: Name of ffmpeg process.

`description`: Description for ffmpeg process.

`program`: Path to ffmpeg bin. If `null` then remux will use default ffmpeg from remux.json.

`args`: Array of ffmpeg arguments.

`cpus`: Taskset settings.

```
{processes:[
  {
    "name": "NullTV",
    "description": "Ffmpeg testsrc to udp://127.0.0.1:30000",
    "program": null,
    "args": [
      "-re",
      "-f","lavfi",
      "-i","testsrc=duration=-1:size=640x360:rate=25",
      "-c:v","libx264",
      "-g","50",
      "-r","25",
      "-f","mpegts",
      "-y","udp://127.0.0.1:30000"
    ],
    "cpus": "0-1"
  }
]}
```
---
### used modules
  - pm2
  - vorpal
  - chalk
  - cli-table3
  - duration
  - express
  - express-graphql
  - graphql
  - jsonfile
  - request
