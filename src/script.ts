let playlistTime = {
  hours: 0,
  minutes: 0,
  seconds: 0
};

function calculatePlaylistDuration() {
  if (!isPlaylist()) return;

  console.log("Calculating playlist duration...");
  const videos = getPlaylistItems();
  const notSeen = filterAlreadySeenVideos(videos);

  notSeen.forEach(v => {
    observeVideoLength(v);
  });
}

const isPlaylist = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("list");
};

const getPlaylistItems = () => {
  document.getElementById;
  return Array.from(document.querySelectorAll("#playlist-items"));
};

const filterAlreadySeenVideos = (videos: any[]) => {
  const watching = videos.find(v => v.hasAttribute("selected"));
  if (!watching) return videos;

  const index = videos.indexOf(watching);
  return videos.slice(index, videos.length);
};

const observeVideoLength = (video: Document) => {
  const { observer, options } = setupObserver();

  observer.observe(video, options);
};

const setupObserver = () => {
  const observer = new MutationObserver(checkVideoDuration);
  const options: MutationObserverInit = {
    childList: true,
    subtree: true
  };

  return { observer, options };
};

function checkVideoDuration(
  mutations: MutationRecord[],
  observer: MutationObserver
) {
  for (let mutation of mutations) {
    if (mutation.type !== "childList") continue;
    mutation.addedNodes.forEach(n => {
      if (
        n.nodeName === "SPAN" &&
        n.textContent &&
        n.textContent.includes(":")
      ) {
        addTime(n.textContent);
        observer.disconnect();
      }
    });
  }
}

const addTime = (time: string) => {
  const split = time.split(":");
  if (!split.length || split.length === 1) return;

  if (split.length === 2) {
    addMinutesSeconds(split);
  } else {
    addHoursMinutesSeconds(split);
  }
  correctTime();
  renderTime();
};

const addMinutesSeconds = (split: string[]) => {
  playlistTime.minutes += parseInt(split[0], 10);
  playlistTime.seconds += parseInt(split[1], 10);
};

const addHoursMinutesSeconds = (split: string[]) => {
  playlistTime.hours += parseInt(split[0], 10);
  playlistTime.minutes += parseInt(split[1], 10);
  playlistTime.seconds += parseInt(split[2], 10);
};

const correctTime = () => {
  if (playlistTime.seconds >= 60) {
    playlistTime.minutes += Math.floor(playlistTime.seconds / 60);
    playlistTime.seconds = playlistTime.seconds % 60;
  }
  if (playlistTime.minutes >= 60) {
    playlistTime.hours += Math.floor(playlistTime.minutes / 60);
    playlistTime.minutes = playlistTime.minutes % 60;
  }
};

function renderTime() {
  const playlistHeader = document.getElementById("header-description");
  if (!playlistHeader) return;

  const timeHeader = getTimeElement(playlistHeader);

  const { hours, minutes, seconds } = getFormattedTime();
  timeHeader.textContent = `${hours}:${minutes}:${seconds}`;
}

const getTimeElement = (playlistHeader: HTMLElement) => {
  let timeHeader = document.querySelector("#header-TIME");
  if (!timeHeader) {
    timeHeader = document.createElement("h2");
    timeHeader.setAttribute(
      "class",
      "yt-simple-endpoint style-scope yt-formatted-string"
    );
    timeHeader.setAttribute("id", "header-TIME");
    playlistHeader.appendChild(timeHeader);
  }
  return timeHeader;
};

const getFormattedTime = () => {
  let { hours: h, minutes: m, seconds: s } = playlistTime;

  const hours = `${h < 10 ? "0" : ""}${h}`;
  const minutes = `${m < 10 ? "0" : ""}${m}`;
  const seconds = `${s < 10 ? "0" : ""}${s}`;

  return { hours, minutes, seconds };
};

calculatePlaylistDuration();
