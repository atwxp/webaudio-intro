# 数字化音频

声音的数字化即是通过采样、量化、编码，把模拟信号的音源表示成由 `0/1` 组成的二进制数据，所以数字音频是不连续的。

## 声音是怎么产生的

> 声音是一种压力波：当演奏乐器、拍打一扇门或者敲击桌面时，他们的振动会引起介质——空气分子有节奏的振动，使周围的空气产生疏密变化，形成疏密相间的纵波，这就产生了声波，这种现象会一直延续到振动消失为止 —— [百度百科](http://baike.baidu.com/link?url=tTtOrggiKNOWPu5IPZW5N-J6jH5IfehvEglQCxnYyblsf1H_ME7enNfk1lt4bq_a9XrcdrF285RzjKui9eUBip_WieBLYBcbOnndtPR0tXa)

<figure>
    <img src="http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0105.png" alt="">
    <figcaption>图片来自 <a href="http://chimera.labs.oreilly.com/books/1234000001552/">WebAudio Book - Oreilly</a></figcaption>
</figure>

## PCM 编码

`PCM(Pulse Code Modulation)` 即脉冲编码调制，是把模拟信号转换成数字信号的一种技术，主要有三个过程：采样、量化、编码。

采样即按照一定的频率(每隔一段时间)去采集一次模拟信号的值。

量化就是把采集到的数据转换为二进制数据，量化精度就是每个采样点能表示的数据范围，一般量化精度有 `4bit, 8bit, 16bit...` 也就是能存储 `2^4, 2^8, 2^16...` 个不同的值。量化精度的大小影响到声音的质量，位数越多，量化后的波形越接近原始波形，声音的质量越高，需要的存储空间也越多。

`PCM` 的两个重要指标是采样频率和量化精度，常见的 `CD` 音频的采样频率是 `44.1KHZ`，采样位数为 `16bit`。下图是一个把模拟信号转换至 `4bit PCM` 的取样和量化：

<figure>
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Pcm.svg/500px-Pcm.svg.png" alt="">
    <figcaption>图片来自 <a href="https://zh.wikipedia.org/wiki/%E8%84%88%E8%A1%9D%E7%B7%A8%E7%A2%BC%E8%AA%BF%E8%AE%8A">脉冲编码调制 - Wikipedia</a></figcaption>
</figure>

在想想平时我们听歌的过程，实际就是播放器读取文件中(`MP3, WAV, WMA...`) 的音频数据，经过解码得到 `PCM` 数据；相反在录音的时候就是音频驱动不断的采样得到 `PCM` 数据再完成压缩存储。

`PCM` 把声音就转化为一个很长很长的数组(在 `web audio` 中，这个数组被抽象为 `AudioBuffer`)，所以原始数据是非常大的，因此音频通常会压缩处理。

压缩分为无损和有损：无损压缩(如 `FLAC/ALAC`) 保证了在压缩和解压缩的过程中，数值不会改变；有损压缩(如 `MP3`) 则会去除一些无用的数据。

通常使用比特率 `bit rate` 作为一种数字音乐压缩效率的参考性指标，表示播放音频时每秒的传输量，比如音乐文件常使用 `128Kbps`，当然我们可以随意指定 `bit rate` 进行压缩，假如一个 `128Kbps` 的3分钟音频，其文件大小就是 `128K * 3 * 60 / 8 = 2880KB = 2.8125MB`

## 音频格式

前面我们提到原始 `PCM` 由于过大所以通常采用压缩的方法减小体积方便传输，常见的编解码器(能通过某种算法压缩与解压缩数字音频数据到音频文件或流媒体音频编码格式)如下：

- `AAC`，比 `MP3` 更先进的音频压缩技术，目的在于取代陈旧的 `MP3`

- `Ogg Vorbis`，和 `AAC` 一样用以替代 `MP3` 的下一代音频压缩技术。但是 `Vorbis` 是免费、开源的

- `MP3` 丢弃掉 `PCM` 音频数据中对人类听觉不重要的数据（类似于 `JPEG` 是一个有损图像压缩），从而获得一个比较小的文件

主流浏览器对音频格式的支持：

|            |  IE  |  FF   | Chrome| Opera | Safari |
| --------   |:----:|:-----:|:-----:|:-----:|:------:|
| MP3        | 9    | NO    |  5    | NO    | 3.1    |
| Ogg Vorbis | NO   | 3.6   |  5    | 10.5  | NO     |
| WAV        | NO   | 3.6   | 8     |  10.5 |  3.1   |

从这个表可以看出要覆盖主流浏览器，我们需要准备两种音频格式：`Ogg Vorbis, MP3`，由于`WAV` 是很简单的无损压缩（可以认为就是把 `PCM` 数据塞进 `WAV` 容器）所以体积会相对比较大，不建议使用该格式。

这里还有一个 [在线音频格式检测](http://hpr.dogphilosophy.net/test/) 的工具，方便检测使用的浏览器对音频格式的兼容情况。

