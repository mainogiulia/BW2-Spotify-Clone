let trackListArray = [];

// oggetto track
class TrackObj {
  constructor(_title, _artist, _cover, _track, _duration) {
    this.title = _title;
    this.artist = _artist;
    this.cover = _cover;
    this.track = _track;
    this.duration = _duration;
  }
}

const highlightTrack = () => {
  const currentTrackObj = JSON.parse(localStorage.getItem("track"));
  const currentTitle = currentTrackObj.title;
  const allRows = document.querySelectorAll(".trackRow");
  for (let i = 0; i < allRows.length; i++) {
    row = allRows[i];
    const title = row.querySelector(".song").innerHTML;
    if (currentTitle === title && !playerAudio.paused) {
      row.classList.add("track-played");
    } else {
      row.classList.remove("track-played");
    }
  }
};

const playTrack = () => {
  let trackInfo = JSON.parse(localStorage.getItem("track"));
  const title = JSON.parse(localStorage.getItem("track")).title;
  const artist = trackInfo.artist;
  const cover = trackInfo.cover;
  const track = trackInfo.track;
  const seconds = trackInfo.duration % 60;
  let formattedSeconds;
  if (seconds < 10) {
    formattedSeconds = "0" + seconds;
  } else {
    formattedSeconds = seconds;
  }
  const duration = `${Math.trunc(trackInfo.duration / 60)}:${formattedSeconds}`;
  const trackTitle = document.querySelector(".song-title");
  trackTitle.innerText = title;
  const trackArtist = document.querySelector(".song-artist");
  trackArtist.innerText = artist;
  const trackCover = document.querySelector(".song-info img");
  trackCover.src = cover;
  const trackDuration = document.querySelector(".time");
  trackDuration.innerText = duration;
  const playerAudio = document.getElementById("playerAudio");
  const playerTrack = playerAudio.querySelector("source");
  document.querySelector(".song-info").classList.add("visibility");
  playerTrack.src = track;
  playerAudio.load();
};

const playPauseBtn = document.querySelector(".playPauseBtn");

const switchBtn = function () {
  if (playerAudio.paused) {
    playerAudio.play();
    // const loopButton = document.querySelector(".loopButton");
    // loopButton.addEventListener("click", () => {
    //   loopButton.classList.toggle("activeButton");
    //   playerAudio.loop = !playerAudio.loop; // Alterna tra ripetere o no la traccia
    // });
    playPauseBtn.innerHTML = `<i class="fas fa-pause-circle btnPauseTrack "></i>`;
  } else {
    playerAudio.pause();
    playPauseBtn.innerHTML = `<i class="fas fa-play-circle btnPauseTrack"></i>`;
  }
};

playPauseBtn.addEventListener("click", function () {
  switchBtn();
});

//gestisce il riempimento della barra di Audio-range
const rangeAudio = document.getElementById("rangeAudio");
rangeAudio.addEventListener("input", function () {
  const value = this.value;
  this.style.background = `linear-gradient(to right, #1ed760 ${value}%, #404040 ${value}%)`;

  playerAudio.volume = value / 100;
});

window.onload = () => {
  if (localStorage.getItem("track")) {
    playTrack();
    document.querySelector(".song-info").classList.add("visibility");
  }
};
