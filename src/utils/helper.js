export function nomalizeSong(data) {
  let {
    name,
    picUrl,
    song: { artists },
  } = data;

  return {
    name,
    picUrl,
    artists: getArtists(artists),
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

export function formatDate(s) {
  let date = new Date(s);
  let time = new Date().getTime() - date.getTime();

  let years = date.getFullYear();
  let months = date.getMonth() + 1;
  let day = date.getDate();

  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (time / 3600000 < 24) {
    return addZero(hours) + ":" + addZero(minutes);
  } else {
    return addZero(years) + "年" + addZero(months) + "月" + addZero(day) + "日";
  }
}

function addZero(n) {
  return n < 10 ? "0" + n : n + "";
}

export function formatTime(duration) {
  let minutes = Math.floor(duration / 1000 / 60);
  let seconds = Math.floor(duration / 1000) % 60;
  return addZero(minutes) + ":" + addZero(seconds);
}

export function songUrl(id) {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}
