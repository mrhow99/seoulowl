// Create map and center based on your location

const container = document.querySelector(".map");

let options = {
  center: new kakao.maps.LatLng(37.5, 126.97),
  level: 10
};

const map = new kakao.maps.Map(container, options);
map.setMaxLevel(10);

// Create zoom controller
function zoomIn() {
  map.setLevel(map.getLevel() - 1);
}

function zoomOut() {
  map.setLevel(map.getLevel() + 1);
}

// Create current position button

let locPosition;

function currentPos() {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    locPosition = new kakao.maps.LatLng(lat, lon);
    map.setCenter(locPosition);
    map.setLevel(4);
  });
}

// Custom pin

let imageSrc1 = "img/restaurant.png";
let imageSrc2 = "img/coffee.png";
let imageSize = new kakao.maps.Size(25, 25);
const rMarkerImage = new kakao.maps.MarkerImage(imageSrc1, imageSize);
const cMarkerImage = new kakao.maps.MarkerImage(imageSrc2, imageSize);

// Get coordinates through address and create & put
const requestData = "./js/data/info.json";
const request = new XMLHttpRequest();

request.open("GET", requestData);

request.responseType = "json";
request.send();

const geocoder = new kakao.maps.services.Geocoder();

let coordsList = [];

request.onload = function() {
  const info = request.response;
  const rInfo = info.rInfo;
  const cInfo = info.cInfo;
  const franchise = info.franchise_menu;

  const main = document.querySelector(".map-container");

  let clickedOverlay = null;

  console.log(cInfo.length + rInfo.length);

  for (let i = 0; i < rInfo.length; i++) {
    geocoder.addressSearch(rInfo[i].address, (result, status) => {
      if (status === "ZERO_RESULT") {
        console.log(rInfo[i]);
        return;
      }

      let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      coordsList.push(coords);

      let marker = new kakao.maps.Marker({
        map: map,
        image: rMarkerImage,
        position: coords,
        zIndex: 2
      });

      let customOverlay = new kakao.maps.CustomOverlay({
        position: coords,
        content: `<span class="name">${rInfo[i].name}</span>`,
        zIndex: 1
      });

      const rContent = document.createElement("div");
      const rTitle = document.createElement("h1");
      const rAddress = document.createElement("p");
      const rContact = document.createElement("p");
      const rOpenhours = document.createElement("p");
      const closeBtn = document.createElement("span");
      const rMenu = document.createElement("p");

      rTitle.innerHTML = rInfo[i].name;
      closeBtn.innerHTML = "&times;";
      rAddress.innerHTML = `<i class="fas fa-map-marker-alt" style="margin-right: .5rem;"></i>${rInfo[i].address}`;
      rContact.innerHTML = `<i class="fas fa-phone" style="margin-right: .5rem;"></i><a href="tel:${rInfo[i].contact}">${rInfo[i].contact}</a>`;
      rOpenhours.innerHTML = `<i class="fas fa-clock" style="margin-right: .5rem;"></i>${rInfo[i].open_hours}`;
      rMenu.innerHTML = `<i class="far fa-clipboard" style="margin-right: .5rem"></i>메뉴보기`;

      rContent.className = "content";
      rTitle.className = "title";
      rAddress.className = "address";
      rContact.className = "contact";
      rOpenhours.className = "open-hours";
      rMenu.className = "menu";
      closeBtn.className = "close-btn";

      main.appendChild(rContent);
      rContent.appendChild(rTitle);

      rContent.appendChild(rAddress);
      rContent.appendChild(rContact);
      rContent.appendChild(rOpenhours);
      rContent.appendChild(rMenu);
      rContent.appendChild(closeBtn);

      closeBtn.addEventListener("click", function() {
        rContent.style.display = "none";
      });

      kakao.maps.event.addListener(marker, "click", function() {
        if (clickedOverlay) {
          clickedOverlay.style.display = "none";
        }
        rContent.style.display = "block";
        clickedOverlay = rContent;
      });

      // Show place name when level gets deeper and hide otherwise
      kakao.maps.event.addListener(map, "zoom_changed", function() {
        level = map.getLevel();

        if (1 <= level && level <= 6) {
          customOverlay.setMap(map);
        } else if (level >= 7) {
          customOverlay.setMap(null);
        }
      });
    });
  }

  for (let i = 0; i < cInfo.length; i++) {
    geocoder.addressSearch(cInfo[i].address, (result, status) => {
      if (status === "ZERO_RESULT") {
        console.log(cInfo[i]);
        return;
      }

      let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      let marker = new kakao.maps.Marker({
        map: map,
        image: cMarkerImage,
        position: coords,
        clickable: true,
        zIndex: 2
      });

      let customOverlay = new kakao.maps.CustomOverlay({
        position: coords,
        content: `<span class="name">${cInfo[i].name}</span>`,
        zIndex: 1
      });

      const cContent = document.createElement("div");
      cContent.className = "content";
      main.appendChild(cContent);

      const cTitle = document.createElement("h1");
      cTitle.innerHTML = cInfo[i].name;
      cContent.appendChild(cTitle);

      const closeBtn = document.createElement("span");
      closeBtn.className = "close-btn";
      closeBtn.innerHTML = "&times;";
      cContent.appendChild(closeBtn);

      cTitle.className = "title";

      closeBtn.addEventListener("click", function() {
        cContent.style.display = "none";
      });

      kakao.maps.event.addListener(marker, "click", function() {
        if (clickedOverlay) {
          clickedOverlay.style.display = "none";
        }
        cContent.style.display = "block";
        clickedOverlay = cContent;
      });

      kakao.maps.event.addListener(map, "zoom_changed", function() {
        level = map.getLevel();

        if (1 <= level && level <= 6) {
          customOverlay.setMap(map);
        } else if (level >= 7) {
          customOverlay.setMap(null);
        }
      });
    });
  }
};
