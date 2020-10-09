const timesExp = /\[(\d{2}):(\d{2})\.(\d{2,3})]/g;
const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})]/;

export function lyricParser(data) {
  return {
    klyric: parseLyric(data.klyric.lyric || ""),
    tlyric: parseLyric(data.tlyric.lyric || ""),
    lrc: parseLyric(data.lrc.lyric || ""),
    lyricUser: data.lyricUser,
    transUser: data.transUser,
  };
}

function parseLyric(lyric) {
  if (!lyric) return "";
  const lyrics = lyric.split("\n");
  const res = [];
  for (let i = 0; i < lyrics.length; i++) {
    let times = lyrics[i].match(timesExp);
    if (times == null) continue;

    if (times.length > 1) {
      // 同一句歌词不同时间
      times.forEach((time) => line(lyrics[i], time, res));
    } else {
      line(lyrics[i], times[0], res);
    }
  }
  return res;
}

function line(lyric, time, res) {
  // 替换每行歌词中所有时间
  let content = lyric.replace(timesExp, "");
  // 过滤空内容
  if (!content) return;
  time = time.match(timeExp);
  time = time[1] * 60 * 1000 + time[2] * 1000 + time[3] * 1;
  res.push({ time, content });
}

// 合并翻译歌词
export function mergeLrcTlyric(lrc, tlyric) {
  let res = [];

  if (tlyric.length) {
    lrc.forEach((l) => {
      const { time, content } = l;
      const lyricItem = { time, content, contents: [content] };
      const sameTimeTLyric = tlyric.find(({ time: tLyricTime }) => tLyricTime === time);
      if (sameTimeTLyric) {
        const { content: tLyricContent } = sameTimeTLyric;
        if (content) {
          lyricItem.contents.push(tLyricContent);
        }
      }
      res.push(lyricItem);
    });
  } else {
    res = lrc.map(({ time, content }) => ({
      time,
      content,
      contents: [content],
    }));
  }

  res.sort((a, b) => a.time - b.time);

  return res;
}
