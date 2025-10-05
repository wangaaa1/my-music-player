<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的音乐播放器</title>
  <link rel="stylesheet" href="style.css">
</head>
<script>
// 禁止开发者工具
document.addEventListener('keydown', function (e) {
    if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 67 || e.keyCode === 74)) || (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
        return false;
    }
});
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
</script>

<body>
  <div class="player">
    
    <!-- 左侧：封面和唱片区域 -->
    <div class="left-section">
      <div class="vinyl-container">
        <div class="vinyl-arm"></div>
        <div class="vinyl-disc">
          <div class="cover-container">
            <img id="cover" src="images/cover1.jpg" alt="歌曲封面">
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧：播放列表 -->
    <div class="right-section">
      <div class="playlist-header">播放列表</div>
      <ul id="playlist"></ul>
    </div>

    <!-- 底部：播放控制栏 -->
    <div class="bottom-bar">
      <div class="song-info">
        <h2 id="title">歌曲1</h2>
      </div>

      <div class="player-controls">
        <div class="controls">
          <button id="prev">⏮</button>
          <button id="play" class="play-btn">▶</button>
          <button id="next">⏭</button>
        </div>

        <div class="progress-container">
          <span id="current-time">00:00</span>
          <input type="range" id="progress" value="0" min="0" max="100">
          <span id="duration">00:00</span>
        </div>
      </div>

      <div class="extra-controls">
        <div class="speed-control">
          <label for="speed">倍速:</label>
          <select id="speed">
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="1.75">1.75x</option>
            <option value="2">2x</option>
          </select>
        </div>
        
        <div class="timer-control">
          <label for="timer">定时:</label>
          <select id="timer">
            <option value="0">不定时</option>
            <option value="0.5">0.5小时</option>
            <option value="1">1小时</option>
            <option value="1.5">1.5小时</option>
            <option value="2">2小时</option>
            <option value="2.5">2.5小时</option>
            <option value="3">3小时</option>
            <option value="3.5">3.5小时</option>
            <option value="4">4小时</option>
            <option value="4.5">4.5小时</option>
            <option value="5">5小时</option>
            <option value="5.5">5.5小时</option>
            <option value="6">6小时</option>
            <option value="6.5">6.5小时</option>
            <option value="7">7小时</option>
            <option value="7.5">7.5小时</option>
            <option value="8">8小时</option>
          </select>
        </div>
      </div>
    </div>

    <audio id="audio"></audio>
  </div>

  <script src="script.20240512_4_fixed.js"></script>
  <script>
    // 控制唱片旋转动画
    const playerEl = document.querySelector('.player');
    audio.addEventListener('play', () => {
      playerEl.classList.add('playing');
    });
    audio.addEventListener('pause', () => {
      playerEl.classList.remove('playing');
    });
    audio.addEventListener('ended', () => {
      playerEl.classList.remove('playing');
    });
  </script>
</body>
</html>
