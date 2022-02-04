var radio = new ambient_sound();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "play"){
      radio.playStream(request.value);
    }
    else if (request.action == "stop"){
      radio.stopStream();
    }
    else if (request.action == "player_volume"){
      radio.streamVolume(request.volume);
    }
    else if (request.action == "pause"){
      radio.pauseStream();
    }
});

// is timer on or off; false = off; true = on
var currentState = false;

var hms;
var settings;
var timer;
var timerState = 1;
var soundState = true;
var repeatState = false;
var timerStates = ['break', 'focus'];
var badgeColors = ['#E74C3C', '#3498DB']
var initialTime;
var currentTime;
var elapsedTime;



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

  if (request.command === "stopTimer" && currentState){
    currentState = false;
    handleTimer(currentState);
    sendResponse({message: "Stopping Timer"});
  }

  else if (request.command === "startTimer" && !currentState){
    currentState = true;
    initialTime = hmstoSeconds(request.focus_time);
    handleTimer(currentState);
    sendResponse({message: "Starting Timer"});
  }

  // else if (request.command === "enableSounds"){
  //   if (request.value==1) {
  //     soundState = true;
  //   } else {
  //     soundState = false;
  //   }
  // }

})

function hmstoSeconds(hms){
  var hms = hms;
  split = hms.split(":");
  if (split.length > 2){
    return split[0]*3600+split[1]*60+split[2]*1;
  }
  return split[0]*60+split[1]*1;
}

function secondsToHms(seconds) {
  seconds = Number(seconds);
  var h = Math.floor(seconds / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 3600 % 60);
  return (
    (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s
  );
}


function handleTimer(currentState){
  // var timeState = timerStates[timerState];
  // chrome.browserAction.setBadgeBackgroundColor({color: badgeColors[timerState]});
  chrome.browserAction.setBadgeBackgroundColor({color: "#3498DB"});
  // handleTimerState(timerState);
  if (initialTime==null) {
    initialTime = hmstoSeconds('25:00');
  }
  //   else {
  //   initialTime = hmstoSeconds(localStorage.getItem("timer_length")+':00');
  // }



  if (currentState){
    // start timer
    elapsedTime = localStorage.getItem("elapsedTime");

    if (elapsedTime==null || elapsedTime==0){
        handleOn(initialTime);
    } else {
        handleOnElapsed(initialTime, elapsedTime);
    }

  }
  else {
    // stop timer
      elapsedTime = localStorage.getItem("elapsedTime");
    // if (repeatState){
      timerState = 1;
      // handleTimerState(timerState);
      // var time = settings['focus'][1]*60;
      // var hms = secondsToHms(time);
      clearInterval(timer);
      // chrome.runtime.sendMessage({command: "updateTimer", "time": hms, "elapsedTime": time, "initialTime":time, "timerState": timerState});
      // storeTime({'hms': ['counter', hms]});
      chrome.browserAction.setBadgeText({text: "0:00"});
    // }
    // else {
    //   clearInterval(timer);

    // }

    // play sound
    if (localStorage.getItem("enableSounds")==1){
      var audio = new Audio('./audio/notification.mp3');
      audio.play();
    }


  }
}


function handleOn(initialTime){

    var start = moment();
    timer = setInterval(function(){
                var diff = moment().diff(start, 'seconds');
                var seconds = initialTime - diff;
                currentTime = secondsToHms(seconds);
                // storeTime({'hms': ['counter', currentTime]});
                chrome.runtime.sendMessage({command: "updateTimer", "time": currentTime, "elapsedTime": seconds, "initialTime":initialTime, "timerState": timerState});

                if (localStorage.getItem("hideSeconds")==1){
                  chrome.browserAction. setBadgeText({text: currentTime.substring(0, currentTime.length-3)});  
                } else {
                  chrome.browserAction. setBadgeText({text: currentTime});  
                }
                var zero = zeroCheck();
                if (zero){
                  clearInterval(timer);
                  handleTimer(false);
                  
                }
    }, 1000);
}


//  


/* 
example

initialTime = 1 min
elapsedTime (from previous timer): 10 seconds

start = current time
diff = seconds since the timer started
seconds [time left] = 1 min - diff
currentTime = time left (another representation)
--

5 seconds in...
diff = (current time - start) = 5 seconds + elapsedTime
seconds = 1 min - 5 seconds = 55 seconds

*/

// resume a timer
function handleOnElapsed(initialTime, elapsedTime){
    // alert(initialTime);
    // alert(elapsedTime); // in seconds
    actualElapsedTime = initialTime - elapsedTime;

    var start = moment();
    timer = setInterval(function(){
                var diff = moment().diff(start, 'seconds');
                var seconds = initialTime - diff - actualElapsedTime;
                currentTime = secondsToHms(seconds);
                // storeTime({'hms': ['counter', currentTime]});
                chrome.runtime.sendMessage({command: "updateTimer", "time": currentTime, "elapsedTime": seconds, "initialTime":initialTime, "timerState": timerState});
                chrome.browserAction. setBadgeText({text: currentTime.substring(0, currentTime.length-3)});
                var zero = zeroCheck();
                if (zero){
                  clearInterval(timer);
                  handleTimer(false);
                  // if (repeatState){
                  //   handleOff();
                  // }
                  // else {
                  //   // handleRepeat()
                  //   handleOff();
                  // }
                }
    }, 1000);
}
  

  // function handleOff(){
  //   clearInterval(timer);
  //   notifyUser(timerState, soundState);
  //   timerState = 1 - timerState;
  //   // handleTimerState(timerState);
  //   handleTimer(currentState);
  // }


  function zeroCheck(){


    if (currentTime === '0:00'){
      localStorage.setItem("elapsedTime",0);
      localStorage.setItem("timerStarted",0);
      return true;
      
    }
    return false
  }


