
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
const STORAGE_KEY_PREFIX = 'last_position_';

const BASE_URL = "https://pub-87c4bbfe187546b79e4389795d9b5341.r2.dev";

let songs = [];
let songIndex = 0;
let resumeTime = null;

// 加载歌曲
function loadSong(song) {
  title.innerText = song.title;
  audio.src = `${BASE_URL}/songs/${song.name}.mp3`;
  cover.src = `${BASE_URL}/images/${song.cover}`;
  highlightPlaylist();

  const savedTime = localStorage.getItem(STORAGE_KEY_PREFIX + song.name);
  resumeTime = savedTime ? parseFloat(savedTime) : null;

  updateTimes();
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
    if (resumeTime !== null && audio.readyState >= 1) {
      audio.currentTime = resumeTime;
      console.log(`[点击播放] 设置 currentTime = ${resumeTime}`);
      resumeTime = null;
    }
    playSong();
  } else {
    pauseSong();
  }

  localStorage.setItem(STORAGE_KEY_PREFIX + songs[songIndex].name, audio.currentTime);
  localStorage.setItem('last_song_index', songIndex);
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// 更新进度条
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.value = progressPercent;
    updateTimes();

    localStorage.setItem(STORAGE_KEY_PREFIX + songs[songIndex].name, audio.currentTime);
    localStorage.setItem('last_song_index', songIndex);
  }
});

function seekAudio() {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
}

progress.addEventListener('input', seekAudio);
progress.addEventListener('change', seekAudio);
progress.addEventListener('touchend', seekAudio);
progress.addEventListener('mouseup', seekAudio);
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
    if (index === songIndex) {
      item.className = 'active';
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      item.className = '';
    }
  });
}

// 初始化
fetch('songs.json?v=' + Date.now())
  .then(response => response.json())
  .then(data => {
    songs = data.map(song => ({
      name: song.name,
      title: song.name,
      cover: song.cover
    }));

    const savedIndex = localStorage.getItem('last_song_index');
    if (savedIndex !== null && songs[savedIndex]) {
      songIndex = parseInt(savedIndex);
    }

    createPlaylist();
    loadSong(songs[songIndex]);
  })
  .catch(error => {
    console.error('加载歌曲列表失败:', error);
  });

// 倍速播放功能
const speedSelect = document.getElementById('speed');
speedSelect.addEventListener('change', () => {
  audio.playbackRate = parseFloat(speedSelect.value);
});

// 定时关闭功能
let pauseTimer = null;
const timerSelect = document.getElementById('timer');
timerSelect.addEventListener('change', () => {
  clearTimeout(pauseTimer);
  const hours = parseFloat(timerSelect.value);
  if (hours > 0) {
    const ms = hours * 60 * 60 * 1000;
    pauseTimer = setTimeout(() => {
      audio.pause();
      alert('播放已自动暂停 ⏸️');
    }, ms);
  }
});

// 每秒保存一次播放位置
let saveInterval = null;
function startSaveTimer() {
  clearInterval(saveInterval);
  saveInterval = setInterval(() => {
    if (!audio.paused && audio.currentTime > 0) {
      localStorage.setItem(STORAGE_KEY_PREFIX + songs[songIndex].name, audio.currentTime);
      localStorage.setItem('last_song_index', songIndex);
    }
  }, 1000);
}
audio.addEventListener('play', startSaveTimer);
audio.addEventListener('pause', () => clearInterval(saveInterval));
audio.addEventListener('ended', () => clearInterval(saveInterval));
window.addEventListener('beforeunload', () => clearInterval(saveInterval));
