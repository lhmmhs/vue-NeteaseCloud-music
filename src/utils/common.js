export function nomalizeSong(id, name, picUrl, artists, duration, album, mvid) {
  return {
    id,
    name,
    picUrl,
    artists,
    duration,
    album,
    url: songUrl(id),
    mvid,
  };
}

export function getArtists(artists) {
  return (artists || []).map((e) => e.name).join("/");
}

export function formatPlayCount(count) {
  if (count > 100000000) {
    count = count / 100000000 + "";
    return count.match(/\d+\.\d/)[0] + "亿";
  } else if (count > 10000) {
    count = count / 10000 + "";
    return count.match(/\d+\.\d/)[0] + "万";
  } else {
    return count;
  }
}

export function formatDate(s, type) {
  if (!s) return;

  let date = new Date(s);
  let time = new Date().getTime() - date.getTime();

  let years = date.getFullYear();
  let months = date.getMonth() + 1;
  let day = date.getDate();

  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (type && type === "-") {
    return zero(years) + type + zero(months) + type + zero(day);
  }

  if (time / 3600000 < 24) {
    return zero(hours) + ":" + zero(minutes);
  } else {
    return zero(years) + "年" + zero(months) + "月" + zero(day) + "日";
  }
}

function zero(n) {
  return n < 10 ? "0" + n : n + "";
}

export function formatTime(duration) {
  let minutes = Math.floor(duration / 1000 / 60);
  let seconds = Math.floor(duration / 1000) % 60;
  return zero(minutes) + ":" + zero(seconds);
}

export function songUrl(id) {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}
