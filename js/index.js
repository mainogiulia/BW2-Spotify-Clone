// endpoint di ricerca
const searchUrl = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
// artisti predefiniti per aggiornare la pagina al caricamento )
const previewArray = ["radiohead", "led zeppelin", "beatles", "jamiroquay", "queen"];
// artista predefinito per aggiornare la parte hero
const suggestedArtist = "Eric Clapton";

// array brani preferiti
const favourites = [];

const indexPreview = () => {
  // ciclo l'array di artisti per la preview
  for (let i = 0; i < previewArray.length; i++) {
    // concateno la url e il nome dell'artista
    fetch(searchUrl + previewArray[i])
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        // chiamo la funzione per la generazione delle card degli album (sezione "altro di ciò che ti piace")
        generateAlbumCards(data.data);
        // chiamo la funzione per la generazione delle card degli album (sezione "i tuoi artisti preferiti")
        generateArtistCards(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const suggestedAlbum = () => {
  // genero url per l'endpoint in base all'artista predefinito
  fetch(searchUrl + suggestedArtist)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then((data) => {
      // genero index per selezionare randomicamente uno tra i primi 10 album dell'artista
      const index = Math.floor(Math.random() * 15);
      // chiamo la funzione per la generazione della hero
      heroSection(data.data[index]);
    })
    .catch((err) => {
      console.log(err);
    });
};

const heroSection = (data) => {
  // url per l'endpoint dell'album
  const albumUrl = "https://striveschool-api.herokuapp.com/api/deezer/album/";
  const albumTitle = data.album.title;
  const albumCover = data.album.cover_big;
  const albumCoverSmall = data.album.cover_small;
  const artistName = data.artist.name;
  // prendo l'id dell'album
  const albumID = data.album.id;
  const title = document.querySelector(".hero h3");
  title.innerHTML = `<a href="./album.html?albumID=${albumID}">${albumTitle}</a>`;
  const coverImg = document.querySelector(".hero img");
  coverImg.src = albumCover;
  coverImg.onclick = () => {
    location.href = `./album.html?albumID=${albumID}`;
  };
  coverImg.style.cursor = "pointer";
  coverImg.alt = albumTitle;
  const artist = document.querySelector(".hero h3 + p");
  artist.innerHTML = `Artista: <span><a href="./artist.html?artistID=${data.artist.id}">${artistName}</a></span>`;
  // genero l'url per l'endpoint dell'album selezionato
  fetch(albumUrl + albumID)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .then((data) => {
      // prendo le info della prima traccia dell'album selezionato
      const firstTrack = data.tracks.data[0];
      const firstTrackTitle = data.tracks.data[0].title;
      // prendo il file audio della prima traccia dell'album selezionato
      const duration = data.tracks.data[0].duration;
      const firstTrackPreview = data.tracks.data[0].preview;
      const playBtn = document.getElementById("play");
      playBtn.onclick = () => {
        const track = new TrackObj(firstTrackTitle, artistName, albumCoverSmall, firstTrackPreview, duration);
        if (localStorage.getItem("tracklist")) {
          const stringOfTrackList = localStorage.getItem("tracklist");
          trackListArray = JSON.parse(stringOfTrackList);
          // trackListArray.unshift(track);
        }
        // else {
        trackListArray.splice(counter, 0, track);
        // trackListArray.push(track);
        // }
        localStorage.setItem("tracklist", JSON.stringify(trackListArray));
        handleTrackList();
      };
      const firstTrackElement = document.createElement("p");
      firstTrackElement.style.marginTop = "1rem";
      firstTrackElement.innerHTML = `Titolo traccia: <span>${firstTrackTitle}</span>`;
      artist.append(firstTrackElement);
    })
    .catch((err) => {
      console.log(err);
    });
};

const generateAlbumCards = (data) => {
  // genero randomicamente un indice tra 0 e 4 (serve per mostrare in ordine sempre diverso le card nella pagina)
  const index = Math.floor(Math.random() * 5);
  // seleziono l'album e l'artista in base all'indice generato
  const artist = data[index].artist;
  const album = data[index].album;
  // seleziono l'elemento HTML dove inserire le card
  const albums = document.querySelector(".albums");
  // creo la card
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("card-wrapper");
  cardWrapper.innerHTML = `
    <div class="card">
      <a href="./album.html?albumID=${album.id}"><img src="${album.cover_medium}" alt="${album.title}" /></a>
      <div class="card-body">
          <a href="./album.html?albumID=${album.id}"><h6 class="playlist-title" title="${album.title}">${album.title}</h6></a>
          <a href="./artist.html?artistID=${artist.id}"><p class="playlist-artist">${artist.name}</p></a>
      </div>
      <div>
        <a href="./album.html?albumID=${album.id}">
         <i class="fa-solid fa-play"></i>
        </a>
      </div>
    </div>
    `;
  // aggiungo la card creata all'HTML
  albums.appendChild(cardWrapper);
};

const generateArtistCards = (data) => {
  // genero randomicamente un indice tra 0 e 4 (serve per mostrare in ordine sempre diverso le card nella pagina)
  const index = Math.floor(Math.random() * 5);
  // seleziono l'artista in base all'indice generato
  const artist = data[index].artist;
  const artists = document.querySelector(".artists");
  // genero la card
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("card-wrapper");
  cardWrapper.innerHTML = `
    <div class="card">
      <a href="./artist.html?artistID=${artist.id}"><img src="${artist.picture_medium}" alt="${artist.name}" /></a>
      <div class="card-body">
          <a href="./artist.html?artistID=${artist.id}"><h6 class="playlist-title" title="${artist.name}">${artist.name}</h6></a>
      </div>
    `;
  // aggiungo la card all'HTML
  artists.appendChild(cardWrapper);
};

suggestedAlbum();
indexPreview();

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
