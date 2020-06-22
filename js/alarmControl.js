App = window.App || {};
App.AlarmControl = (function Main() {
    var logger = App.Logger.create({
        loggerName: 'AlarmControl',
        loggerEl: document.querySelector('.logsContainer'),
        logLevel: App.Logger.logLevels.ALL
    });

    var date = new Date();
    var counter = 0;
    var repeat = false;
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.',
        'Oct.', 'Nov.', 'Dec.'];
    var hour = date.getHours();
    var minute = date.getMinutes();

    var hourEl = document.getElementById('alarm-hr');
    var minuteEl = document.getElementById('alarm-min');
    var dayEl = document.getElementById('alarm-day');
    var mounthEl = document.getElementById('alarm-month');
    var yearEl = document.getElementById('alarm-year');
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    function getMonthName(i) {
        return months[i];
    }

    function incCounter() {
        counter += 1;
    }

    function getCounter() {
        return counter;
    }

    function alarmInit() {
        // default current time in alarm settings
        hourEl.innerHTML = App.Utils.numberToMinimalDigitString(hour, 2);
        minuteEl.innerHTML = App.Utils.numberToMinimalDigitString(minute, 2);
        dayEl.innerHTML = App.Utils.numberToMinimalDigitString(day, 2);
        mounthEl.innerHTML = months[month];
        yearEl.innerHTML = year;
    }

    function prevHr() {
        if (hour > 0) {
            hour -= 1;
            hourEl.innerHTML = App.Utils.numberToMinimalDigitString(hour, 2);
        }
    }

    function nextHr() {
        if (hour < 23) {
            hour += 1;
            hourEl.innerHTML = App.Utils.numberToMinimalDigitString(hour, 2);
        }
    }

    function prevMin() {
        if (minute > 0) {
            minute -= 1;
            minuteEl.innerHTML = App.Utils.numberToMinimalDigitString(minute, 2);
        }
    }

    function nextMin() {
        if (minute < 59) {
            minute += 1;
            minuteEl.innerHTML = App.Utils.numberToMinimalDigitString(minute, 2);
        }
    }

    function prevDay() {
        if (day > 1) {
            day -= 1;
            dayEl.innerHTML = App.Utils.numberToMinimalDigitString(day, 2);
        }
    }

    function nextDay() {
        if (day < daysInMonth) {
            day += 1;
            dayEl.innerHTML = App.Utils.numberToMinimalDigitString(day, 2);
        }
    }

    function prevMonth() {
        if (month > 0) {
            month -= 1;
            mounthEl.innerHTML = months[month];
            daysInMonth = new Date(year, month + 1, 0).getDate();
        }
    }

    function nextMonth() {
        if (month < 11) {
            month += 1;
            mounthEl.innerHTML = months[month];
            daysInMonth = new Date(year, month + 1, 0).getDate();
        }
    }

    function prevYear() {
        if (year > date.getFullYear()) {
            year -= 1;
            yearEl.innerHTML = year;
        }
    }

    function nextYear() {
        // because of year 2038 problem
        if (year < 2037) {
            year += 1;
            yearEl.innerHTML = year;
        }
    }

    function repeatConfirm() {
        repeat = true;
        logger.log('Set repeat attribute to true');
    }

    function repeatDeny() {
        repeat = false;
        logger.log('Set repeat attribute to false');
    }

    function submit() {
        var alarms = tizen.alarm.getAll();
        var repeating = repeat ? ' Repeating' : ' Not repeating';
        var alarmDate = new Date(year, month,
            day, hour, minute);
        var text = App.Utils.numberToMinimalDigitString(hour, 2) + ':'
            + App.Utils.numberToMinimalDigitString(minute, 2) + ' '
            + App.Utils.numberToMinimalDigitString(day, 2) + ' '
            + months[month] + ' ' + year + repeating;
        var appControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/view');
        var alarmAbsol = null;

        if (alarmDate === null || alarmDate.getTime() < date.getTime()) {
            logger.error('Wrong date or time!');
        } else if (alarms.length < 4) {
            alarmAbsol = repeat ? new tizen.AlarmAbsolute(alarmDate, tizen.alarm.PERIOD_DAY)
                : new tizen.AlarmAbsolute(alarmDate);
            tizen.alarm.add(alarmAbsol, App.Main.appId, appControl);
            logger.log('next scheduled alarm is ' + alarmDate);
            App.Main.createListEl(text);
        } else {
            logger.error('Alarms list is full!');
        }
    }

    function removeAlarm(item, index, alarms) {
        var alarm = alarms[index];
        try {
            if (typeof alarm.date === 'undefined') {
                App.TimerControl.setIsSet(false);
            }
            tizen.alarm.remove(alarm.id);
            item.parentNode.removeChild(item);
            logger.log('Successfully removed alarm.');
        } catch (error) {
            logger.error('Failed to remove alarm.');
        }
    }

    return {
        counter: counter,
        getMonthName: getMonthName,
        incCounter: incCounter,
        getCounter: getCounter,
        alarmInit: alarmInit,
        prevHr: prevHr,
        nextHr: nextHr,
        prevMin: prevMin,
        nextMin: nextMin,
        prevDay: prevDay,
        nextDay: nextDay,
        prevMonth: prevMonth,
        nextMonth: nextMonth,
        prevYear: prevYear,
        nextYear: nextYear,
        repeatConfirm: repeatConfirm,
        repeatDeny: repeatDeny,
        submit: submit,
        removeAlarm: removeAlarm
    };
}());
