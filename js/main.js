App = window.App || {};
App.Main = (function Main() {
    var basicMenu = null;
    var subbuttonsMenu = null;
    var timerMenu = null;
    var alarmMenu = null;
    var logger = null;
    var subbuttonsSystemEl = document.querySelector('.subbuttons-system');
    var subbuttonsTimerEl = document.querySelector('.subbuttons-timer');
    var subbuttonsAlarmEl = document.querySelector('.subbuttons-alarm');
    var subbutonsAlrmListEL = document.querySelector('.alarms-list');
    var appId = tizen.application.getCurrentApplication().appInfo.id;

    // Basic Control
    function onNewAlarmBtnClick() {
        subbuttonsSystemEl.classList.remove('hidden');
        subbuttonsMenu = App.Navigation.registerMenu({
            domEl: subbuttonsSystemEl,
            name: 'Subbuttons',
            nextMenu: 'Basic'
        });
        basicMenu.previousMenu = 'Subbuttons';
    }

    function onTimerBtnClick() {
        subbuttonsTimerEl.classList.remove('hidden');
        subbuttonsAlarmEl.classList.add('hidden');
        App.Navigation.unregisterMenu('AlarmUpperbuttons');
        App.Navigation.unregisterMenu('AlarmLowerbuttons');

        timerMenu = App.Navigation.registerMenu({
            domEl: document.querySelector('.timer-lower-buttons'),
            name: 'TimerLowerbuttons',
            nextMenu: 'Subbuttons',
            syncWith: 'TimerUpperbuttons'
        });

        App.Navigation.registerMenu({
            domEl: document.querySelector('.timer-upper-buttons'),
            name: 'TimerUpperbuttons',
            nextMenu: 'TimerLowerbuttons',
            syncWith: 'TimerLowerbuttons'
        });

        basicMenu.previousMenu = 'Subbuttons';
        subbuttonsMenu.previousMenu = 'TimerLowerbuttons';
        timerMenu.previousMenu = 'TimerUpperbuttons';
    }

    function onAlarmBtnClick() {
        subbuttonsAlarmEl.classList.remove('hidden');
        subbuttonsTimerEl.classList.add('hidden');
        App.Navigation.unregisterMenu('TimerUpperbuttons');
        App.Navigation.unregisterMenu('TimerLowerbuttons');

        alarmMenu = App.Navigation.registerMenu({
            domEl: document.querySelector('.alarm-lower-buttons'),
            name: 'AlarmLowerbuttons',
            nextMenu: 'Subbuttons',
            syncWith: 'AlarmUpperbuttons'
        });

        App.Navigation.registerMenu({
            domEl: document.querySelector('.alarm-upper-buttons'),
            name: 'AlarmUpperbuttons',
            nextMenu: 'AlarmLowerbuttons',
            syncWith: 'AlarmLowerbuttons'
        });

        basicMenu.previousMenu = 'Subbuttons';
        subbuttonsMenu.previousMenu = 'AlarmLowerbuttons';
        alarmMenu.previousMenu = 'AlarmUpperbuttons';
    }

    function onEditAlarmBtnClick() {
        subbutonsAlrmListEL.classList.remove('hidden');

        if (tizen.alarm.getAll().length > 0) {
            hideSubbuttons();

            App.Navigation.registerMenu({
                domEl: subbutonsAlrmListEL,
                name: 'Listbuttons',
                nextMenu: 'Basic',
                alignment: 'vertical'
            });

            App.Navigation.changeActiveMenu('Listbuttons');
        } else {
            logger.log('No alarms to edit');
        }
    }

    function onRemoveAllBtnClick() {
        var alarmsList = document.getElementById('list');

        hideSubbuttons();
        tizen.alarm.removeAll();
        logger.log('Removed all registered alarms in the storage.');

        while (alarmsList.firstChild) {
            alarmsList.removeChild(alarmsList.firstChild);
        }

        App.TimerControl.setIsSet(false);
    }

    function hideSubbuttons() {
        subbuttonsSystemEl.classList.add('hidden');
        subbuttonsAlarmEl.classList.add('hidden');
        subbuttonsTimerEl.classList.add('hidden');
        App.Navigation.unregisterMenu('TimerUpperbuttons');
        App.Navigation.unregisterMenu('TimerLowerbuttons');
        App.Navigation.unregisterMenu('AlarmUpperbuttons');
        App.Navigation.unregisterMenu('AlarmLowerbuttons');
        App.Navigation.unregisterMenu('Subbuttons');
    }

    function createListEl(text) {
        var node = document.createElement('li');
        var textnode = document.createTextNode(text);
        var button = document.createElement('button');

        button.innerHTML = 'Remove';
        button.className = 'remove';
        button.setAttribute('data-list-item', '');
        button.setAttribute('id', App.AlarmControl.getCounter());
        node.setAttribute('id', 'alarm' + App.AlarmControl.getCounter());
        node.appendChild(textnode);
        node.appendChild(button);
        document.getElementById('list').appendChild(node);
        App.AlarmControl.incCounter();
    }

    // checks whether the application was opened by SmartHub or Alarm API and if it was opened by API performs an action
    function alarmCall() {
        var alert = document.getElementById('alert');
        var reqAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();
        var appControl = reqAppControl.appControl;

        if (appControl && appControl.operation === 'http://tizen.org/appcontrol/operation/view') {
            alert.classList.remove('hidden');
            setTimeout(function () {
                alert.classList.add('alert-fade');
            }, 4000);
        }
    }

    function alarmListHandler(element) {
        var nodes = document.getElementById('list').children;
        var nodesArray = [];
        var alarms = tizen.alarm.getAll();
        var item = document.getElementById('alarm' + (element.id));
        var index;
        var i;

        for (i = 0; i < nodes.length; i += 1) {
            nodesArray[i] = nodes[i];
        }

        index = nodesArray.indexOf(item);

        alarms = tizen.alarm.getAll();
        App.Navigation.changeActiveMenu('Basic');

        if (alarms.length > 0) {
            App.AlarmControl.removeAlarm(item, index, alarms);
        }
    }

    function showExistingAlarms() {
        var alarms = tizen.alarm.getAll();

        alarms.forEach(
            function (alarm) {
                var repeating = null;
                var text = null;

                if (typeof alarm.date === 'undefined') {
                    // show Timer
                    App.TimerControl.setIsSet(true);
                    createListEl('Timer');
                    App.TimerControl.countdown(alarm);
                } else {
                    // show Alarm
                    repeating = alarm.period ? ' Repeating' : ' Not repeating';
                    text = App.Utils.numberToMinimalDigitString(alarm.date.getHours(), 2) + ':'
                        + App.Utils.numberToMinimalDigitString(alarm.date.getMinutes(), 2) + ' '
                        + App.Utils.numberToMinimalDigitString(alarm.date.getDate(), 2) + ' '
                        + App.AlarmControl.getMonthName(alarm.date.getMonth()) + ' '
                        + alarm.date.getFullYear() + ' ' + repeating;
                    createListEl(text);
                }
            }
        );
    }

    // adding handlers to buttons
    function addButtonsHandlers() {
        var buttonsWithHandlers = [
            // Basic menu
            { elementSelector: '.new-alarm', handler: onNewAlarmBtnClick },
            { elementSelector: '.edit-alarm', handler: onEditAlarmBtnClick },
            { elementSelector: '.remove-all', handler: onRemoveAllBtnClick },
            { elementSelector: '.timer', handler: onTimerBtnClick },
            { elementSelector: '.alarm', handler: onAlarmBtnClick },

            // Timer
            { elementSelector: '.prev-num', handler: App.TimerControl.prevNumber },
            { elementSelector: '.next-num', handler: App.TimerControl.nextNumber },
            { elementSelector: '.prev-type', handler: App.TimerControl.prevType },
            { elementSelector: '.next-type', handler: App.TimerControl.nextType },
            { elementSelector: '.timer-submit', handler: App.TimerControl.submit },

            // Alarm
            { elementSelector: '.prev-hr', handler: App.AlarmControl.prevHr },
            { elementSelector: '.next-hr', handler: App.AlarmControl.nextHr },
            { elementSelector: '.prev-min', handler: App.AlarmControl.prevMin },
            { elementSelector: '.next-min', handler: App.AlarmControl.nextMin },
            { elementSelector: '.prev-day', handler: App.AlarmControl.prevDay },
            { elementSelector: '.next-day', handler: App.AlarmControl.nextDay },
            { elementSelector: '.prev-month', handler: App.AlarmControl.prevMonth },
            { elementSelector: '.next-month', handler: App.AlarmControl.nextMonth },
            { elementSelector: '.prev-year', handler: App.AlarmControl.prevYear },
            { elementSelector: '.next-year', handler: App.AlarmControl.nextYear },
            { elementSelector: '.repeat-yes', handler: App.AlarmControl.repeatConfirm },
            { elementSelector: '.repeat-no', handler: App.AlarmControl.repeatDeny },
            { elementSelector: '.alarm-submit', handler: App.AlarmControl.submit }
        ];

        App.KeyHandler.addHandlersForButtons(buttonsWithHandlers);
    }

    window.onload = function () {
        basicMenu = App.Navigation.getMenu('Basic');

        logger = App.Logger.create({
            loggerName: 'Main',
            loggerEl: document.querySelector('.logsContainer'),
            logLevel: App.Logger.logLevels.ALL
        });

        addButtonsHandlers();
        App.AlarmControl.alarmInit();
        showExistingAlarms();
        // delete alarm from list
        App.KeyHandler.addHandlerForDelegated('#list', alarmListHandler);
        alarmCall();
    };

    return {
        appId: appId,
        createListEl: createListEl
    };
}());
