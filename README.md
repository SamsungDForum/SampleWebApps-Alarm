# Alarm

This application demonstrates the use of `tizen.alarm` API for scheduling the system alarm.
With this API you can set an alarm or timer, which will start at specified time,
open application and perform an action.

## How to use the application

Use arrows and ENTER buttons on TV remote to set the alarm or timer, then submit.
Timer counts down time to launch the app, alarm will launch the app at specified date and time.

Alarms can be set only until 2038, because of [year 2038 problem](https://en.wikipedia.org/wiki/Year_2038_problem).


## Supported platforms

2015 and newer


### Privileges and metadata

In order to use `tizen.alarm` API the following privileges must be included in `config.xml`:

```xml
<tizen:privilege name="http://tizen.org/privilege/alarm" />
<tizen:privilege name="http://tizen.org/privilege/alarm.get" />
<tizen:privilege name="http://tizen.org/privilege/alarm.set" />
<tizen:privilege name="http://tizen.org/privilege/application.launch" />
```

### File structure

```
Alarm - Alarm sample app root folder
│
├── assets - resources used by this app
│   │
│   └── JosefinSans-Light.ttf - font used in application
│
├── css - styles used in the application
│   │
│   ├── main.css - styles specific for the application
│   └── style.css - style for application's template
│
├── js - scripts used in the application
│   │
│   ├── alarmControl.js - helper script providing methods for alarm oriented buttons
│   ├── init.js - script that runs before any other for setup purpose
│   ├── keyhandler.js - module responsible for handling keydown events
│   ├── logger.js - module allowing user to register logger instances
│   ├── main.js - main application script
│   ├── navigation.js - module responsible for handling in-app focus and navigation
│   ├── timerControl.js - helper script providing methods for timer oriented buttons
│   └── utils.js - module with useful tools used through application
│
├── CHANGELOG.md - changes for each version of application
├── config.xml - application's configuration file
├── icon.png - application's icon
├── index.html - main document
└── README.md - this file
```

## Other resources

*  **Alarm API**  
  https://developer.samsung.com/tv/develop/api-references/tizen-web-device-api-references/alarm-api

* **Application API**  
  https://developer.samsung.com/tv/develop/api-references/tizen-web-device-api-references/application-api


## Copyright and License

**Copyright 2019 Samsung Electronics, Inc.**

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
