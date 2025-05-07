const audio = document.getElementById('audio');
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playlistEl = document.getElementById('playlist'); // 新增：歌单

const songs = [
  { name: "song1", title: "歌曲1", cover: "cover1.jpg" },
  { name: "song2", title: "歌曲2", cover: "cover2.jpg" },
  { name: "song3", title: "歌曲3", cover: "cover3.jpg" }
];

let songIndex = 0;

// 加载歌曲
function loadSong(song) {
  title.innerText = song.title;
  audio.src = `songs/${song.name}.mp3`;
  cover.src = `images/${song.cover}`;
  highlightPlaylist();
}

// 播放
function playSong() {
  audio.play();
  playBtn.innerText = '⏸️';
}

// 暂停
function pauseSong() {
  audio.pause();
  playBtn.innerText = '▶️';
}

// 上一首
function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

// 下一首
function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

// 点击按钮控制
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// 更新进度条
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.value = progressPercent;
    updateTimes();
  }
});
progress.addEventListener('input', () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});
audio.addEventListener('ended', nextSong);

// 更新时间显示
function updateTimes() {
  currentTimeEl.innerText = formatTime(audio.currentTime);
  durationEl.innerText = formatTime(audio.duration);
}
function formatTime(time) {
  const minutes = Math.floor(time / 60) || 0;
  const seconds = Math.floor(time % 60) || 0;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 生成歌单列表
function createPlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = song.title;
    li.dataset.index = index;
    li.addEventListener('click', () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

// 高亮当前播放的歌曲
function highlightPlaylist() {
  const items = playlistEl.querySelectorAll('li');
  items.forEach((item, index) => {
    item.style.color = index === songIndex ? '#e91e63' : '#ffffff';
  });
}

// 初始加载
createPlaylist();
loadSong(songs[songIndex]);
