# mauron85-background-geolocation-example-ionic2

## Description

Provide an example of applicationn that integrate cordova-plugin-mauron85-background-geolocation (free version) into Ionic 2

## Installing the application

* `git clone https://github.com/oliviercherrier/mauron85-background-geolocation-example-ionic2`
* `cd mauron85-background-geolocation-example-ionic2`
* `mkdir www`
* `npm install`
* `ionic  run android`

### Troubleshooting

#### Installation of cordova-plugin-device

Just ignore below error:
```Error: Command failed: C:\windows\system32\cmd.exe /s /c "cordova plugin add --
save cordova-plugin-device"

    at ChildProcess.exithandler (child_process.js:213:12)
    at emitTwo (events.js:87:13)
    at ChildProcess.emit (events.js:172:7)
    at maybeClose (internal/child_process.js:827:16)
    at Process.ChildProcess._handle.onexit (internal/child_process.js:211:5)
V Installed platform android```

#### Mimap icon missing

In case of below error
```C:\mauron85-background-geolocation-example-ionic2\platforms\android\res\xml\auth
enticator.xml:5:19-31: AAPT: No resource found that matches the given name (at '
icon' with value '@mipmap/icon').

C:\mauron85-background-geolocation-example-ionic2\platforms\android\res\xml\auth
enticator.xml:6:24-36: AAPT: No resource found that matches the given name (at '
smallIcon' with value '@mipmap/icon').```


Add a copy of file `./platforms/android/res/mimap-whatever/ic_launcher.png` to `./platforms/android/res/mipap/icon.png` andd run ionic run android again