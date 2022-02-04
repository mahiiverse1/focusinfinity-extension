function playRadio(radioItem) {
  chrome.runtime.sendMessage({action: 'play', value: radioItem});
  // DisplayCurrentRadio(radioItem);
  localStorage.setItem("last_track_chosen",radioItem);
  // playRadioUpdateUIelements();
  loadingRadioUpdateUIelements();
}

function loadingRadioUpdateUIelements() {
  $("#player_loading").show();
  $("#player_play").hide();
  $("#player_stop").hide();
  
  $('#loading-msg').fadeIn('slow', function () {
    $(this).delay(5000).fadeOut('slow');
  });
}

function playRadioUpdateUIelements() {
  $("#player_play").hide();
  $("#player_loading").fadeOut(3000);
  $("#player_stop").show(2000);
  
}

function stopRadioUpdateUIelements(){
  $("#player_stop").hide();
  $("#player_loading").hide();
  $("#player_play").show();
}

function stopAudio() {
    chrome.runtime.sendMessage({action: 'stop'});
    // DisplayCurrentRadio(null);
    stopRadioUpdateUIelements();
    
}


$('.single-column').on('click', function (){
     var selected_track = $(this).attr('id');
    

     if (localStorage.getItem("is_playing")==1){
        if (selected_track==localStorage.getItem('last_track_chosen')){
          stopAudio();
        } else {
          stopAudio();
          playRadio(selected_track);    
        }
    } else {
        stopAudio();
        playRadio(selected_track);    

    }
    // stopAudio();
    // var selected_track = $(this).attr('id');
    // console.log(selected_track);
    // playRadio(selected_track);
})


$('#player_play').on('click', function (){
    // continue playing the last track
    var radioItem = localStorage.getItem('last_track_chosen');
    if (radioItem) {
      playRadio(radioItem);
    } else {
      playRadio("forest");
    }
})

$('#player_stop').on('click', function (){
    stopAudio();
})



function setAmbienceTab() {
    $("#ambience_tab").show();
    $("#focus_timer_tab").hide();
    $("#science_tab").hide();
    $("#about_tab").hide();
    $("#ambience_tab_nav").addClass("active");
    $("#focus_timer_tab_nav").removeClass("active");
    $("#science_tab_nav").removeClass("active");
    $("#about_tab_nav").removeClass("active");
    localStorage.setItem("current_tab",0);
}

function setFocusTimerTab() {
    $("#ambience_tab").hide();
    $("#focus_timer_tab").show();
    $("#science_tab").hide();
    $("#about_tab").hide();
    $("#ambience_tab_nav").removeClass("active");
    $("#focus_timer_tab_nav").addClass("active");
    $("#science_tab_nav").removeClass("active");
    $("#about_tab_nav").removeClass("active");
    localStorage.setItem("current_tab",1);
}


function setScienceTab() {
    $("#ambience_tab").hide();
    $("#focus_timer_tab").hide();
    $("#about_tab").hide();
    $("#science_tab").show();

    $("#science_tab_nav").addClass("active");
    $("#about_tab_nav").removeClass("active");
    $("#ambience_tab_nav").removeClass("active");
    $("#focus_timer_tab_nav").removeClass("active");
}

function setAboutTab() {
    $("#ambience_tab").hide();
    $("#focus_timer_tab").hide();
    $("#science_tab").hide();
    $("#about_tab").show();

    
    $("#about_tab_nav").addClass("active");
    $("#science_tab_nav").removeClass("active");
    $("#ambience_tab_nav").removeClass("active");
    $("#focus_timer_tab_nav").removeClass("active");
}


$("#focus_timer_tab_nav").click(function() {
    setFocusTimerTab();
})  


$("#ambience_tab_nav").click(function() {
    setAmbienceTab();
})  

$("#science_tab_nav").click(function() {
    setScienceTab();
})  

$("#about_tab_nav").click(function() {
    setAboutTab();
}) 

$("#timer_progress").click(function() {
    setFocusTimerTab();
})  



// function setVolumeRange() {
// $('#player_volume').on('input', function () {
//     var chosen_volume = $('#player_volume').html( $(this).val() );
//     localStorage.setItem("player_volume",chosen_volume);
// });
// // }

function setVolume(e) {
  var value = document.querySelector('#player_volume').value;
  value = value / 100;
  // localStorage.setItem('player_volume', value);
  chrome.runtime.sendMessage({action: 'player_volume',volume: value});
  // console.log(value);
}

// $(document).ready(function(){ 

    // set date message
    // var check = moment();
    // var weekDayNum = check.format('D');
    // var weekDayName = check.format('ddd');
    // var monthName = check.format('MMMM');
    // $("#date_formatted_nicely").text(weekDayName + ", " + monthName + " " + weekDayNum);


    // if (localStorage.getItem("current_tab")==0){
    //   setAmbienceTab();
    // } else {
    //   setFocusTimerTab();
    // }

    // if (localStorage.getItem("player_volume") !== null) {
      // if the user has already selected a preferred volume, use that
      // setVolumeRange()
      // localStorage.getItem("player_volume");

    // } else {

    // }




// })



// after document is loaded
document.addEventListener('DOMContentLoaded', function () {
  // set date message
    var check = moment();
    var weekDayNum = check.format('D');
    var weekDayName = check.format('ddd');
    var monthName = check.format('MMMM');
    $("#date_formatted_nicely").text(weekDayName + ", " + monthName + " " + weekDayNum);

    if (localStorage.getItem("current_tab")==0){
      setAmbienceTab();
    } else if (localStorage.getItem("current_tab")==1){
      setFocusTimerTab();
    } else {
      setAmbienceTab();
    }

    if (localStorage.getItem("player_volume") === null) {
      localStorage.setItem("player_volume",0.5);
    }
    document.querySelector('#player_volume').value = localStorage.getItem('player_volume') * 100;
    document.querySelector('#player_volume').addEventListener('input', setVolume);

    if (localStorage.getItem("is_playing")==1){
        playRadioUpdateUIelements();

    } else {
        // playRadioUpdateUIelements();
        stopRadioUpdateUIelements()
        // $("#player_stop").hide();
        // $("#player_play").show();
    }



});


// whenever the popup opens, load these two functions
// 
// getSettings();

// 
window.addEventListener('DOMContentLoaded', function(){
  getSavedValues(); //if saved values exist
  addMessageListeners();

// settings
var timer_length_mins = "25";


$("#submit").on("click", function(){
  button = document.getElementById('submit').value;
  if (button === "Start"){
    if (localStorage.getItem("elapsedTime")==0 && localStorage.getItem("timerStarted")==0) {
      $( "#reset" ).trigger( "click" );
    }

    timerControl(button);
    // console.log("Timer Started");
    button = document.getElementById('submit').value = 'Pause';
    localStorage.setItem("timerStarted",1);
  }
  else {
    timerControl(button);
    // console.log("Timer Stopped");
    button = document.getElementById('submit').value = 'Start';
    localStorage.setItem("timerStarted",0);
    // localStorage.setItem("elapsedTime",elapsedTime);
  }
})

$('#reset').on('click', function (){
  // stop the timer

    timerControl('Pause');
    document.getElementById("counter").innerHTML = timer_length_mins + ':00'
    var focus_time = document.getElementsByClassName("focus")[0].value + ':00';
    // var elapsedTime = settings['fill'][3];
    var elapsedTime = focus_time;
    var initialTime = focus_time;
    updateTimer(focus_time, 25*60, 25*60, 0);
    localStorage.setItem("timerStarted",0);
    console.log("Timer Stopped");
    button = document.getElementById('submit').value = 'Start';
    localStorage.setItem("elapsedTime",0);
    
})


function timerControl(state){
  if(state === 'Start'){
    var focus_time = document.getElementsByClassName("focus")[0].value + ':00';
    chrome.runtime.sendMessage({command: "startTimer", focus_time: focus_time});
     
  }
  else {
    // localStorage.setItem("last_time",);

    chrome.runtime.sendMessage({command: "stopTimer"}, function(response){
      chrome.browserAction.setBadgeText({text: ''});
    })
  }
}





$('#play_sound_id').change(function() {
    if($(this).is(":checked")) {
        chrome.runtime.sendMessage({command: "enableSounds", value: 1});
        localStorage.setItem("enableSounds",1);
    } else {
        chrome.runtime.sendMessage({command: "enableSounds", value: 0});
        localStorage.setItem("enableSounds",0);
    }
});




$('#hide_seconds_id').change(function() {
    if($(this).is(":checked")) {
        localStorage.setItem("hideSeconds",1);
    } else {
        localStorage.setItem("hideSeconds",0);
    }
});







function getSavedValues() {
  timer_length_mins = localStorage.getItem("timer_length");

  if (timer_length_mins==null){
    timer_length_mins = "25";
  }

  if (localStorage.getItem("elapsedTime")!=null && localStorage.getItem("elapsedTime")!=0){
    // elapsed time is actually time left
    updateTimer(secondsToHmsPopup(localStorage.getItem("elapsedTime")), localStorage.getItem("elapsedTime"), timer_length_mins, 1);
  } else {
    $('#counter').text(timer_length_mins + ":00");
  }

  if (localStorage.getItem("timer_length")!=null){ 

    $('#focus_time_setting').val(timer_length_mins);
    
  }

  if (localStorage.getItem("timerStarted")==0 || localStorage.getItem("timerStarted")==null){ 
    button = document.getElementById('submit').value = 'Start';
  } else {
    button = document.getElementById('submit').value = 'Pause';
  }

  if (localStorage.getItem("enableSounds")!=null){
    if (localStorage.getItem("enableSounds")==0){
      document.getElementById('play_sound_id').checked = false;  
    } else {
      document.getElementById('play_sound_id').checked = true;  
    }
  }

   if (localStorage.getItem("hideSeconds")!=null){
    if (localStorage.getItem("hideSeconds")==0){
      document.getElementById('hide_seconds_id').checked = false;  
    } else {
      document.getElementById('hide_seconds_id').checked = true;  
    }
  }
  
  
}


function addMessageListeners(){
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
      switch (request.command) {
        case 'updateTimer':
          var time = request.time;
          var elapsedTime = request.elapsedTime;
          var initialTime = request.initialTime;
          timerState = request.timerState;
          updateTimer(time, elapsedTime, initialTime, timerState);
          // sendResponse({message: "Timer Updated"});
          break
        case 'setSubmit':
          var value = submitOptions[request.value];
          button = document.getElementById('submit').value = value;
          break
        case 'playAudio':
          // alert("startedplaying");
          playRadioUpdateUIelements();
        // case 'loadingAudio':
          
      }
    });
  }

  function updateTimer(time, elapsedTime, initialTime, timerState){
    // alert("time: "+time);
    // alert("elapsedTime: "+elapsedTime);
    var time = time;
    var elapsedTime = elapsedTime;
    var initialTime = initialTime;
    timerState = timerState;
    var percent = 100*((initialTime - elapsedTime)/initialTime);
    document.getElementById("counter").innerHTML = time;
    fillCircle(timerState, time, elapsedTime, initialTime);
    localStorage.setItem("elapsedTime",elapsedTime);
    document.getElementById("timer_progress").innerHTML = time;
    // chrome.runtime.sendMessage({command: 'storeValue', value: {'fill': [timerState, time, elapsedTime, initialTime]}}, function(response){
      // console.log(response);
      // chrome.runtime.sendMessage({command: 'getSites'});
    // });
  }

  function fillCircle(timerState, time, elapsedTime, initialTime){
    var percent = 100*((initialTime - elapsedTime)/initialTime);
    switch (timerState){
      case 1:
        if(percent <= 100){
          $('.timer').css({background: "linear-gradient(to top, #acecc8 "+percent+"%,transparent "+percent+"%,transparent 100%)"});
        }
        break
      case 0:
        if(percent <= 100){
          $('.timer').css({background: "linear-gradient(to top, #E74C3C "+percent+"%,transparent "+percent+"%,transparent 100%)"});
        }
        break
    }
  }


$('#focus_time_setting').on('input', function() { 
    localStorage.setItem("timer_length", $(this).val());
    timer_length_mins = $(this).val();
    $( "#reset" ).trigger( "click" );
});

  });

function secondsToHmsPopup(seconds) {
  seconds = Number(seconds);
  var h = Math.floor(seconds / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 3600 % 60);
  return (
    (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s
  );
}


$('#smrlink').on('click', function (){
  chrome.tabs.create({ url: "https://resumeworded.com/?ref=rofocus" });
})