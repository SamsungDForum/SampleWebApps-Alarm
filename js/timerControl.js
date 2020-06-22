App = window.App || {};
App.TimerControl = (function Main() {
    var logger = App.Logger.create({
        loggerName: 'TimerControl',
        loggerEl: document.querySelector('.logsContainer'),
        logLevel: App.Logger.logLevels.ALL
    });

    var number = 10;
    var type = 0;
    var isSet = false;
    var types = ['MIN', 'HR', 'DAY'];
    var numberEl = document.getElementById('timer-number');
    var typeEl = document.getElementById('timer-type');

    function setIsSet(value) {
        isSet = value;
    }

    function prevNumber() {
        if (number > 1) {
            number -= 1;
            numberEl.innerHTML = App.Utils.numberToMinimalDigitString(number, 2);
        }
    }

    function nextNumber() {
        if (number < 59) {
            number += 1;
            numberEl.innerHTML = App.Utils.numberToMinimalDigitString(number, 2);
        }
    }

    function prevType() {
        if (type > 0) {
            type -= 1;
            typeEl.innerHTML = types[type];
        }
    }

    function nextType() {
        if (type < types.length - 1) {
            type += 1;
            typeEl.innerHTML = types[type];
        }
    }

    function submit() {
        var alarmRel = null;
        var sec = null;
        var appControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/view');
        var alarms = tizen.alarm.getAll();

        if (!isSet && alarms.length < 4) {
            isSet = true;
            switch (type) {
                case 1:
                    alarmRel = new tizen.AlarmRelative(number * tizen.alarm.PERIOD_HOUR);
                    break;
                case 2:
                    alarmRel = new tizen.AlarmRelative(number * tizen.alarm.PERIOD_DAY);
                    break;
                case 0: // Fallthrough
                default:
                    alarmRel = new tizen.AlarmRelative(number * tizen.alarm.PERIOD_MINUTE);
                    break;
            }
            tizen.alarm.add(alarmRel, App.Main.appId, appControl);
            sec = alarmRel.getRemainingSeconds();
            logger.log('New timer set for ' + sec + ' seconds.');
            App.Main.createListEl('Timer');
            countdown(alarmRel);
        } else {
            logger.error('Timer already set or alarms list full.');
        }
    }

    function countdown(alarmType) {
        var sec = null;
        var interval = setInterval(function () {
            sec = alarmType.getRemainingSeconds();
            document.getElementById('time-left').innerHTML = sec + ' seconds';
            if (sec === null) {
                App.TimerControl.isSet = false;
                document.getElementById('time-left').innerHTML = '';
                clearInterval(interval);
            }
        }, 1000);
    }

    return {
        prevNumber: prevNumber,
        nextNumber: nextNumber,
        prevType: prevType,
        nextType: nextType,
        submit: submit,
        countdown: countdown,
        setIsSet: setIsSet
    };
}());
