const audio = document.getElementById('audio');
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playlistEl = document.getElementById('playlist');

const BASE_URL = "https://pub-87c4bbfe187546b79e4389795d9b5341.r2.dev";  // 这里改成你的Public URL + my-music

let songs = [];
let songIndex = 0;

// 加载歌曲
function loadSong(song) {
  title.innerText = song.title;
  audio.src = `${BASE_URL}/songs/${song.name}.mp3`;
  cover.src = `${BASE_URL}/images/${song.cover}`;
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
    item.className = index === songIndex ? 'active' : '';
  });
}

// 初始加载：从 songs.json 动态读取
fetch('songs.json?v=' + Date.now())
  .then(response => response.json())
  .then(data => {
    songs = data.map(song => ({
      name: song.name,
      title: song.name,  // 文件名作为歌曲标题
      cover: song.cover
    }));
    createPlaylist();
    loadSong(songs[songIndex]);
  })
  .catch(error => {
    console.error('加载歌曲列表失败:', error);
  });
