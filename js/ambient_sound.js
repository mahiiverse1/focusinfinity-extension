class ambient_sound {


	constructor() {
		// this.api_version = '1';
		// this.api_url = './sounds_db.js';
		this.player = null;
		// player_state:
		// 0 = stopped
		// 1 = playing
		// 2 = loading
		// 3 = error
		this.updateEventPlayerState({state: 0, msg: "stopped"});
		// initialize player variables
		localStorage.setItem('data_radio', null);
		// set default volume if none (otherwise radio would be muted for new users)
		// localStorage.setItem('player_volume', this.getVolume());
		// this.updateOnlineRadioList();
	}
	

	
	
	
	pauseStream() {
		if(this.player_state['state'] == 1) {
			this.updateEventPlayerState({state: 0, msg: "stopped"});
			this.player.pause();
		}else if(this.player_state['state'] == 0) {
			this.updateEventPlayerState({state: 0, msg: "playing"});
			this.player.play();
		}
	}

	getVolume() {
		var vol = localStorage.getItem('player_volume');
		if (vol == null) {
			return 1;
		}else{
			return vol;
		}
	}
	
	streamVolume(value) {
		if(value > 1) {
			value = 1;
		}else if(value < 0) {
			value = 0;
		}
		if(this.player != null) {
			this.player.volume(value);
		}
		localStorage.setItem('player_volume', value);
	}

	streamOnplay(id) {
		// this.updateEventPlayerState({state: 1, msg: 'playing 1'});
		// console.log('play');
		chrome.runtime.sendMessage({command: "playAudio" });
	}

	streamOnload() {
		// this.updateEventPlayerState({state: 2, msg: 'loading 1'});
		// localStorage.setItem("is_playing",1);
		// console.log('load');
		// alert("loading");
		chrome.runtime.sendMessage({command: "loadingAudio" });
	}

	streamOnplayerror(id, error) {
		this.updateEventPlayerState({state: 3, msg: error});
		console.log('playerror');
	}

	streamOnloaderror(id, error) {
		this.updateEventPlayerState({state: 3, msg: error});
		console.log('loaderror');
	}

	updateEventPlayerState(state) {
		this.player_state = state;
	}

	resetStream() {
		if (this.player != null){
			this.player.unload();
			this.player = null;
			this.updateEventPlayerState({state: 0, msg: "Reset"});
		}
	}

	playStream(radioItem) {
		this.resetStream();

		var audio_url = null;

		if (radioItem=="coffee_shop"){
			var coffee_shop_urls = ["https://api.rofocus.com/audio/rofocus-coffee-shop-1.m4a", "https://api.rofocus.com/audio/rofocus-new-coffee-shop-3.mp3"];
			audio_url = coffee_shop_urls[Math.floor(Math.random() * coffee_shop_urls.length)];
			// audio_url = "https://api.rofocus.com/audio/rofocus-coffee-shop-1.m4a";
		} else if (radioItem=="beach"){
			var beach_urls = ["https://api.rofocus.com/audio/rofocus-beach.m4a", "https://api.rofocus.com/audio/rofocus-new-beach.mp3"];
			audio_url = beach_urls[Math.floor(Math.random() * beach_urls.length)];
		} else if (radioItem=="paris_city_center"){
			var paris_city_center_urls = ["https://api.rofocus.com/audio/rofocus-berlin-city-center.m4a", "https://api.rofocus.com/audio/rofocus-copenhagen-outdoors.m4a", "https://api.rofocus.com/audio/rofocus-busy-central-london.m4a"];
			audio_url = paris_city_center_urls[Math.floor(Math.random() * paris_city_center_urls.length)];
		} else if (radioItem=="forest"){
			// var forest_urls = ["https://api.rofocus.com/audio/rofocus-amazon-forest-river.m4a", "https://api.rofocus.com/audio/rofocus-forest-in-the-mountains.m4a"];
			var forest_urls = ["https://api.rofocus.com/audio/rofocus-amazon-forest-river.m4a"];
			audio_url = forest_urls[Math.floor(Math.random() * forest_urls.length)];
		} else if (radioItem=="experimental_temple"){
			audio_url = "https://api.rofocus.com/audio/rofocus-exotic-calm.m4a";
		} else if (radioItem=="underwater"){
			audio_url = "https://api.rofocus.com/audio/rofocus-underwater.m4a";
		} else if (radioItem=="rain"){
			audio_url = "https://api.rofocus.com/audio/rofocus-rainy-mountains.m4a";
		} else if (radioItem=="campfire"){
			var campfire_urls = ["https://api.rofocus.com/audio/rofocus-campfire-1.m4a", "https://api.rofocus.com/audio/rofocus-campfire-2.m4a"];
			audio_url = campfire_urls[Math.floor(Math.random() * campfire_urls.length)];
		} else if (radioItem=="chirping_birds"){
			var morning_birds_urls = ["https://api.rofocus.com/audio/rofocus-morning-birds.m4a", "https://api.rofocus.com/audio/rofocus-morning-birds-2.m4a", "https://api.rofocus.com/audio/rofocus-morning-birds-3.m4a"];
			audio_url = morning_birds_urls[Math.floor(Math.random() * morning_birds_urls.length)];
		} else if (radioItem=="university-campus"){
			var student_campus_urls = ["https://api.rofocus.com/audio/rofocus-copenhagen-outdoors.m4a", "https://api.rofocus.com/audio/rofocus-bruges-students.m4a"];
			audio_url = student_campus_urls[Math.floor(Math.random() * student_campus_urls.length)];
		} else if (radioItem=="restaurants"){
			var restaurants_urls = ["https://api.rofocus.com/audio/rofocus-rome-restaurant.m4a", "https://api.rofocus.com/audio/rofocus-college-campus-cafe.m4a"];
			audio_url = restaurants_urls[Math.floor(Math.random() * restaurants_urls.length)];
		} else if (radioItem=="dusk-woods"){
			var dusk_urls = ["https://api.rofocus.com/audio/rofocus-new-dusk-in-the-woods-long.mp3", "https://api.rofocus.com/audio/rofocus-dusk-woods.m4a"];
			audio_url = dusk_urls[Math.floor(Math.random() * dusk_urls.length)];
		} else if (radioItem=="normal-winds"){
			var light_wind_urls = ["https://api.rofocus.com/audio/rofocus-normal-wind-1.m4a", "https://api.rofocus.com/audio/rofocus-natural-wind.m4a", "https://api.rofocus.com/audio/rofocus-natural-wind-heavy.m4a"];
			audio_url = light_wind_urls[Math.floor(Math.random() * light_wind_urls.length)];
		} else if (radioItem=="heavy-winds"){
			audio_url = "https://api.rofocus.com/audio/rofocus-real-wind.m4a";
		} else if (radioItem=="stormy-winds"){
			audio_url = "https://api.rofocus.com/audio/rofocus-stormy-wind.m4a";
		} else if (radioItem=="mystical_nature"){
			audio_url = "https://api.rofocus.com/audio/rofocus-new-experimental-nature.mp3";
		} else if (radioItem=="binaural-birds"){
			audio_url = "https://api.rofocus.com/audio/rofocus-new-calm-village.mp3";
		} else if (radioItem=="park-by-river"){
			audio_url = "https://api.rofocus.com/audio/rofocus-new-park-by-the-river.mp3";
		} else if (radioItem=="binaural-space"){
			audio_url = "https://api.rofocus.com/audio/rofocus-new-floating-space.mp3";
		} else if (radioItem=="quiet-city-center"){
			var quiet_city_urls = ["https://api.rofocus.com/audio/rofocus-new-quiet-city-vibes-athens-greece-quiet.mp3", "https://api.rofocus.com/audio/rofocus-new-quiet-city-vibes.mp3"];
			audio_url = quiet_city_urls[Math.floor(Math.random() * quiet_city_urls.length)];
		} else if (radioItem=="waves"){
			var waves_urls = ["https://api.rofocus.com/audio/rofocus-new-waves-1.mp3", "https://api.rofocus.com/audio/rofocus-new-waves-2.mp3"];
			audio_url = waves_urls[Math.floor(Math.random() * waves_urls.length)];
		} else {
			audio_url = "https://api.rofocus.com/audio/rofocus-new-calm-village.mp3";
		}

		
		
		
		this.player = new Howl({
			src: audio_url,
			volume: (this.getVolume()),
			// preload: true,
			// html5: true,
			// format: ['mp3', 'aac', 'ogg', 'm4a'],
			format: ['m4a', 'mp3'],
			loop: true,
			// autoplay: true,
			// onloaderror: this.streamOnloaderror.call(this),
			// onplayerror: this.streamOnplayerror.call(this),
			onload: this.streamOnload.call(this),
			onplay: this.streamOnplay.call(this)
		});
		// setTimeout(function () {
	       	this.player.play();
	    // }, 2000);
		
		localStorage.setItem("is_playing",1);


		// let gasLooper;
		// let gasSound = new Howl({
		//     preload:true
		//   , src: require('./assets/audio/Gas-loop.mp3')
		//   , autoplay: true
		//   , volume: 0.5
		//   , onplay: ()=>{
		//     gasLooper = setTimeout(()=>{
		//       gasSound.play();
		//     },450);
		//   }
		//   , onstop: ()=>{
		//     clearTimeout(gasLooper);
		//   }
		// });

	}

	stopStream() {
		// var radioItem = JSON.parse(localStorage.getItem('data_radio'));
		if (this.player!=null){
			this.player.stop();
		}
		
		// radioItem.state = 0;
		// localStorage.setItem('data_radio', JSON.stringify(radioItem));
		this.updateEventPlayerState({state: 0, msg: "stopped"});
		localStorage.setItem("is_playing",0);
	}

}