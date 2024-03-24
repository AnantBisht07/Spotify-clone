console.log("Hello");
let currentSong = new Audio();
let songs;
let currentFolder;

function secondstoMinutesSecond (seconds) {
  // Input Validation:
  if (isNaN(seconds) || seconds<0){
    return "00:00";
  }
  //Checks if the input-> seconds is not a number (isNaN) or if it is a negative value then it returns Invalid.

  // Time Conversion:
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  // Calculates the number of full minutes (minutes) and the remaining seconds (remainingSeconds) after removing the whole minutes.

  // Formatting:
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  // Converts minutes and remainingSeconds to strings and uses padStart(2, '0') to ensure that they are always represented with at least two digits
  // This is done to maintain a consistent format (e.g., "01" instead of just "1").
  // The first argument (2) is the target length of the resulting string.
 // The second argument ('0') is the string to pad with.

  // Output: 
  const songTime =  `${formattedMinutes}:${formattedSeconds}` 
  return songTime;
  // Constructs a formatted string using the minutes and seconds, separated by a colon, and returns it as the output.

}

async function getSongs(folder) {
  currentFolder = folder;
  // The async keyword is used to declare that the function will operate asynchronously, meaning it will implicitly return a promise.
  let a = await fetch(`${folder}/`);  // hum ab folder likh denge songs ki jgh kyuki folder wise song play krnge.
  // This line sends an HTTP GET request to the URL "http://127.0.0.1:3000/songs/" using the fetch function. The await keyword pauses the execution of the function until the promise returned by fetch is resolved. Once resolved, the response object is assigned to the variable a
  let response = await a.text();
  // The await keyword again pauses the execution until the promise returned by text() is resolved. Once resolved, the response body is assigned to the variable response.
  console.log(response);
  // now songs coming in table form so we have to parse them

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  console.log(as);

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}/`)[1]);
      // ex- "http://example.com/songs/song1.mp3"
      // at index[1] - song1.mp3
      // yeh songs se phly ka kaat dega jo bhi likha hua hai split use krne se.
      // or songs ke bad ka data dega.
    }
  }
  // return songs
  
  // show all the songs in the playlist
  let songUl = document.querySelector(".songslist").getElementsByTagName("ul")[0]
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `
  <ul>
  <li>
  <img class="invert" src="music.svg" alt="">
  <div class="info">
      <div>${song.replaceAll("%20", "")}</div>
  </div>
  <div class="playnow">
      <span>Play now</span>
      <img id="imgplay" class="invert" src="play.svg" alt="">
  </div>
  </li>
  </ul>`;
  }


  // Attach an event listener to each song
  // Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e=>{
  //   console.log(e.querySelector('.info').firstElementChild.innerHTML)
  
  // })
  Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element=> {
      // let infoElement = e.querySelector('.info');
    //   if (infoElement) {
    //     // console.log(infoElement.firstElementChild.innerHTML);
    //     playMusic(infoElement.firstElementChild.innerHTML.trim())
    // }  
    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    });

    // info mai poora div return hora h 
    // ab usko nikalne k lie humne ek var mai store kia
     // qs se hume return ek hi element hota hai to hume indexing krne ki zrurat nahi h
     // agr infoelem null nhi h toh uska firstelem return krdo kyuki 2 div h na info ke andr 
});
return songs;
}
// getSongs();


const playMusic = (track, pause=false) => {
  currentSong.src = `/${currentFolder}/` + track;
  console.log('Playing track:', track);
  if(!pause){
    currentSong.play();
    play.src = "pause.svg";
  }
  // let audio = new Audio();  // isko krne se saare songs click krne par saare songs chlna shuru hojare hain hum chahte hain ek time pr ek hi song chle jipr bhi hum cick kre.
  // currentSong.src = `${folder}` + track;
  // console.log(currentSong.src);
  // is used to get or set the URL of the audio or video element's current media resource.
  // ab isko krne se ek ek song lega
  // shuru mai to pause hi rhta h music
  document.querySelector('.songinfo').innerHTML = decodeURI(track);
  document.querySelector('.songtime').innerHTML = "00:00/ 00:00";

  // currentSrc property is read-only and will give you the current source URL after the media has started loading or playing, but it's not used for setting the source.\

  // currentSong: This is the Audio element that you've created using let currentSong = new Audio();.
// .src: This is a property of the Audio element that holds the URL of the current audio source.
// When you set the src property, it replaces the current audio source with the new one specified by the URL. If you want to play a different audio file, you set the src property to the URL of the new audio file.


}



async function main() {
  // get the list of songs
  await getSongs("songs/Bolly"); // hum folder scan kra rhe hain songs k lie 
  // console.log(songs);
  playMusic(songs[0], true);


// Attach an event listener to play, next and prev
play.addEventListener("click", () => {
  if(currentSong.paused){
    currentSong.play()
    play.src = "pause.svg"
  } 
  else {
    currentSong.pause()
    play.src = "play.svg"
  }
})
// play.src is a way to dynamically change the source (image) of an HTML element with the id "play" based on the state of the audio (playing or paused).


// isko karne se saare li ajynge humare pas 
// Ab agr inpr koi bhi click krega toh song play hojaye jispr bhi click krega

  // // play the first song
  // let audio = new Audio(songs[0]);
  // audio.play();

  // audio.addEventListener("loadeddata", function () {
  //   let duration = audio.duration;
  //   console.log(duration);
  //   // duration variable now holds the duration in seconds of the audio clip.
  // });


  // Listen songs timeupdate event time update hoga song ka
  // seekbar ke hisab se idhr udhr songs ko update kro
  currentSong.addEventListener("timeupdate", ()=>{
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondstoMinutesSecond(currentSong.currentTime)}/${secondstoMinutesSecond(currentSong.duration)}`

    // console.log("currentsong :", currentSong);
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%";  // rozroz.0:0 / rozroz.5:00 * 100 + % 
    // this means yeh left se move krta rhega music ke stn sth.
  })

  // add an eventlistner to seek
  document.querySelector(".seekbar").addEventListener("click", (e)=> {
    // console.log(e.target, e.offsetX);
    let percent = e.offsetX/e.target.getBoundingClientRect().width * 100 
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration* percent) / 100;
  })

  // Add event list for hamburger
  document.querySelector(".hamburger").addEventListener("click", function(){
    document.querySelector(".left").style.left = "0";
  })
  document.querySelector(".close").addEventListener("click", function(){
    document.querySelector(".left").style.left = "-100%";
  })

  // Add event list. for prev 
  document.querySelector("#previous").addEventListener("click", function(){
    console.log("clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    console.log(songs,[index-1])
    if((index-1) >= 0 ){
      playMusic(songs[index-1]);
    }
    
})

  // Add event list. for  next

  document.querySelector("#next").addEventListener("click", function(){
    // console.log(currentSong.src);
    currentSong.pause()
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    // console.log("Songs array:", songs);
    // console.log(songs, [index+1]);
    console.log("Current song URL:", currentSong.src);
    console.log("Index of current song:", index);
    console.log("All songs:", songs);
    if (index !== -1 && index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      console.error("Unable to find the next song.");
    // if((index+1) < songs.length){
    //   playMusic(songs[index+1]);
    // }
    }
  })



  // Add an event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=> {
    // getElementsByTagName returns a collection so indexing kri h 
    console.log("setting volume to ", e.target.value);
    currentSong.volume = parseInt(e.target.value)/100;
  })

  // Add event to mute
  document.querySelector(".volume img").addEventListener("click", function(e) {
    console.log(e.target);
    if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg", "mute.svg")
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else{
      e.target.src = e.target.src.replace("mute.svg", "volume.svg")
      currentSong.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }
  })

  // Load the playlist whenever card is clicked.
  Array.from(document.getElementsByClassName("play")).forEach(e => {
    console.log(e);
    e.addEventListener("click", handleCardClick);

  })
  
  async function handleCardClick(event) {
    playMusic(songs[0], true);
    try {
      const folder = event.currentTarget.dataset.folder;
      if (folder) {
        songs = await getSongs(`songs/${folder}`);
        // playMusic(songs[0])
        console.log(event, event.currentTarget.dataset);
        // jispe event kraya h us elem ko lena h to currentTarget use krte hn
      } else {
        console.error("Dataset folder not found.");
      }
    } catch (error) {
      console.error("Error handling card click:", error);
    }
  }
  
  
}
main();
