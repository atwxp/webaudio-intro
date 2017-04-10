# 历史背景

在页面中嵌入音频即使是现在也不是一件简单的事，不仅需要兼容各种浏览器(`IE/Chrome/Safari...`)和移动设备(`IOS/Android...`)，还可能需要处理各种音频格式。

### bgsound

在 `web` 上首次尝试播放音频是使用 `<bgsound>` 标签，由微软提出但是并没有被其他浏览器厂商接纳成为标准

```html
<bgsound src="xxx.mid" loop="infinite">
```

缺点：

- 非 `IE` 浏览器都不支持

- 非标准且功能有限，简单的后台自动播放

### embed

`<embed>` 是 `Netscape` 引入的，不仅可以嵌入音频，还支持视频等多媒体元素

```html
<embed src="xxxx.mid" />
```
### Flash

`Flash Player` 是第一个跨浏览器兼容嵌入音频的方案，可以使用 `<object>/<embed>` 将插件添加到 `HTML` 页面

```html
<object type="application/x-shockwave-flash" data="haha.swf?audioURL=haha.mp3&autoPlay=true" height="30" width="300">
   <param name="movie" value="haha.swf?audioUrl=haha.mp3&autoPlay=true">
</object>
```

缺点：

- 需要安装插件

- 代码冗余难懂

### audio

`HTML5` 为我们提供了 `audio` 标签支持原生的音频播放，现在大多数主流浏览器都支持

```html
<audio controls="controls">
    <source src="xxx.mp3" type="audio/mp3" />
    <source src="xxx.ogg" type="audio/ogg" />
    Your browser does not support this audio format.
</audio>
```

缺点：

- 一次只能播放一个音频源

- 需要准备多个音频格式

- 没有精确的时间控制

- 无法分析音频数据

- 没法精准的预加载音频，甚至有些浏览器压根就不预加载

### Audio Data API

`Mozilla Firefox` 提出的对 `<audio>` 标签进行的 `js` 扩展，允许开发者读写音频数据：

> The HTML5 specification introduces the `<audio> and <video>` media elements, and with them the opportunity to dramatically change the way we integrate media on the web. The current HTML5 media API provides ways to play and get limited information about audio and video, but gives no way to programatically access or create such media. We present a new Mozilla extension to this API, which allows web developers to read and write raw audio data —— [Audio Data API](https://wiki.mozilla.org/Audio_Data_API#Defining_an_Enhanced_API_for_Audio_.28Draft_Recommendation.29)


```javascript
<audio id="audio" src="song.ogg"></audio>
<script>
var audio = document.getElementById("audio");

audio.addEventListener('MozAudioAvailable', audioAvailable, false);
audio.addEventListener('loadedmetadata', loadedMetadataFunction, false);

function audioAvailable(event) {
    var samples = event.frameBuffer;
    var time    = event.time;

    for (var i = 0; i < frameBufferLength; i++) {
      // Do something with the audio data as it is played.
      processSample(samples[i], channels, rate);
    }
  }
</script>
```

注：该  `API` 已被废弃，`Firefox` 转向对 `Web Audio API` 的支持

### Web Audio API

`W3C` 标准，为开发者对音频数据进行**专业处理、分析、合成(如混音、过滤等)**提供的一套高级 `API`，其特点在于：

- 音频路由图的形象化表示

- 独立于 `<audio>` 标签，允许多个音频源同时播放

- 音频源的多种输入方式

- 精准的时间控制

- 音频数据分析和可视化

- 专业的音频处理方法：滤波器、卷积运算、波形发生器...

- ...
