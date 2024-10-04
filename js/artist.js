const artistUrl = "https://striveschool-api.herokuapp.com/api/deezer/artist";

const addressBarContent = new URLSearchParams(location.search);
const artistId = addressBarContent.get("artistID");

const getArtist = () => {
  fetch(artistUrl + "/" + artistId)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then((data) => {
      artistDefinition(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const artistDefinition = (data) => {
  const artistH1 = document.querySelector("h1");
  const artistH5 = document.querySelector(".right-column h5");
  const heroH5 = document.querySelector("#hero h5");
  const artistImage = document.querySelector(".group-pic img");
  artistH1.innerText = data.name;
  artistH5.innerText = "Di " + data.name;
  heroH5.innerText = data.nb_fan + " ascoltatori mensili";
  artistImage.src = data.picture_small;
};

const getTracks = () => {
  fetch(artistUrl + "/" + artistId + "/top?limit=5")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then((data) => {
      tracksDefinition(data.data);

      // al click sul pulsante spotify
      if (document.querySelector(".spotify-button")) {
        const spotifyBtn = document.querySelector(".spotify-button");
        spotifyBtn.addEventListener("click", () => {
          // crea la tracklist in localstorage
          trackList(data.data);
          // avvia la riproduzione della tracklist
          handleTrackList();
          highlightTrack();
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const tracksDefinition = (tracksArray) => {
  const heroArtistCover = document.querySelector("#hero");
  heroArtistCover.style.backgroundImage = `url(${tracksArray[0].album.cover_xl})`;

  const tableBody = document.querySelector("tbody");
  tracksArray.forEach((track, i) => {
    let seconds = track.duration % 60;
    if (seconds < 10) {
      seconds = "0" + seconds.toString();
    }

    const newRow = document.createElement("tr");
    newRow.classList.add("trackRow");
    newRow.innerHTML = `<td>${i + 1}</td>
        <td><img src="${track.album.cover_small}" alt="" /></td>
        <td class="song" id="${i + 1}">${track.title}</td>
        <td><p>${new Intl.NumberFormat("it-IT").format(track.rank)}</p>
        <a><i class="fa-solid fa-ellipsis-vertical"></i></a>
        </td>
        <td>${Math.trunc(track.duration / 60)}:${seconds}</td>`;
    tableBody.appendChild(newRow);

    //collegamento tra il play della lista di canzoni e il player in basso
    const audio = document.getElementById("playerAudio");

    newRow.onmouseenter = (e) => {
      newRow.onclick = () => {
        trackList(tracksArray);
        counter = newRow.querySelector("td:nth-of-type(3)").id - 1;
        // const artistTrack = new TrackObj(track.title, track.artist.name, track.album.cover_small, track.preview, track.duration);
        // if (localStorage.getItem("tracklist")) {
        //   const stringOfTrackList = localStorage.getItem("tracklist");
        //   trackListArray = JSON.parse(stringOfTrackList);
        //   trackListArray.unshift(artistTrack);
        // } else {
        //   trackListArray.push(artistTrack);
        // }
        // localStorage.setItem("tracklist", JSON.stringify(trackListArray));
        handleTrackList();

        // localStorage.setItem("track", JSON.stringify(artistTrack));
        // playTrack();
        // switchBtn();

        const classAdded = document.querySelector(".track-played");
        if (classAdded) {
          //controlla se un elemento ha la classe e se esiste la toglie!
          classAdded.classList.remove("track-played");
        }

        const currentSong = document.querySelector(".song-title").innerHTML;

        if (currentSong === track.title && !audio.paused) {
          newRow.classList.add("track-played");
        }
      };

      const currentSong = document.querySelector(".song-title").innerHTML;

      const playListButton = e.currentTarget.querySelector("td:nth-child(1)");
      if (currentSong === track.title && !audio.paused) {
        playListButton.innerHTML = `<i class="fa-solid fa-pause"></i>`;
      } else {
        playListButton.innerHTML = `<i class="fa-solid fa-play"></i>`;
      }
    };

    newRow.onmouseleave = (e) => {
      const playListButton = e.currentTarget.querySelector("td:nth-child(1)");
      playListButton.innerHTML = `${i + 1}`;
    };
  });
};

getArtist();
getTracks();

//animazione della barra di ricerca
const searchLink = document.getElementById("searchBar");
searchLink.addEventListener("click", () => {
  const searchModal = document.querySelector(".search-modal");
  searchModal.classList.add("add-animation");
  const searchForm = document.querySelector(".search-modal form");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = document.getElementById("search-input").value;
    location.href = `./search.html?searchKeyWord=${inputValue}`;
  });
});

// evidenzia canzone in riproduzione dalla lista
nextTrack.addEventListener("click", () => {
  highlightTrack();
});

prevTrack.addEventListener("click", () => {
  highlightTrack();
});

playPauseBtn.addEventListener("click", () => {
  highlightTrack();
});
