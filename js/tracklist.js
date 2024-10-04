let counter = 0;
let tempArray = [];

// crea oggetto traccia da aggiungere all'array tracklist
const trackList = (tracklist) => {
  tracklist.forEach((track) => {
    const newTrack = new TrackObj(track.title, track.artist.name, track.album.cover_small, track.preview, track.duration);
    trackListArray.push(newTrack);
  });
  localStorage.setItem("tracklist", JSON.stringify(trackListArray));
};

// gestisce riproduzione tracklist
const handleTrackList = () => {
  const trackList = JSON.parse(localStorage.getItem("tracklist"));
  const track = trackList[counter];
  localStorage.setItem("track", JSON.stringify(track));
  playTrack();
  switchBtn();
  const audioPlayer = document.getElementById("playerAudio");
  //gestisce il button Loop della traccia
  const loopButton = document.querySelector(".loopButton");
  loopButton.addEventListener("click", () => {
    loopButton.classList.toggle("activeButton");
    audioPlayer.loop = !audioPlayer.loop; // Alterna tra ripetere o no la traccia
  });
  // gestisce il passaggio alla traccia successiva quando finisce la traccia
  audioPlayer.addEventListener("loadedmetadata", function () {
    // durata totale della traccia in riproduzione
    let duration = Math.trunc(audioPlayer.duration);
    let progressWidth = 0;
    let timer = setInterval(() => {
      // secondi correnti della traccia in riproduzione
      let seconds = Math.trunc(playerAudio.currentTime);
      progressWidth = Math.trunc((100 * seconds) / duration);
      const progressBar = document.querySelector(".progress-bar > div");
      progressBar.style.width = `${progressWidth}%`;
      // controlla se i secondi correnti sono uguali alla durata totale
      if (duration === seconds) {
        clearInterval(timer);
        // controlla se è l'ultima traccia
        if (counter === trackList.length - 1) {
          // se si, riparte dalla prima
          counter = 0;
        } else {
          // se no, incrementa l'indice per passaggio a traccia successiva
          counter++;
        }
        // mette la traccia da playare in localstorage e chiama le funzioni per il play
        localStorage.setItem("track", JSON.stringify(trackList[counter]));
        highlightTrack();
        playTrack();
        switchBtn();
      }
    }, 1000);
  });
};

// gestisce passaggio a traccia precedente con pulsante
const prevTrack = document.getElementById("prevTrack");
prevTrack.addEventListener("click", () => {
  // controlla se è la prima traccia
  if (counter === 0) {
    // se si, tornando indietro prende l'ultima della tracklist
    counter = trackListArray.length - 1;
  } else {
    // se no va alla precedente
    counter--;
  }
  handleTrackList();
});

// gestisce passaggio a traccia successiva con pulsante
const nextTrack = document.getElementById("nextTrack");
nextTrack.addEventListener("click", () => {
  // controlla se è l'ultima
  if (counter === trackListArray.length - 1) {
    // se si, va alla prima della tracklist
    counter = 0;
  } else {
    // se no, passa alla successiva
    counter++;
  }
  handleTrackList();
});
