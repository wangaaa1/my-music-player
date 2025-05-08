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

const BASE_URL = "https://listenwang.space";  // 你的域名，不要末尾斜杠

let songs = [];
let songIndex = 0;

// 加载歌曲列表（加时间戳避免缓存）
async function loadSongsList() {
    try {
        const response = await fetch(`${BASE_URL}/songs.json?v=${Date.now()}`);
        songs = await response.json();
        createPlaylist();
        loadSong(songs[songIndex]);
    } catch (error) {
        console.error('加载歌曲列表失败:', error);
    }
}

// 加载单首歌曲
function loadSong(song) {
    title.innerText = song.title || song.name;
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

// 拖动进度条
progress.addEventListener('input', () => {
    if (audio.duration) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

// 播放结束后自动播放下一首
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

// 创建歌单列表
function createPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.title || song.name;
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

// 初始化
loadSongsList();
