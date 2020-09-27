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

export function nomalizeMv(data) {
  let { name, picUrl, artists, playCount } = data;

  return {
    name,
    picUrl,
    artists: getArtists(artists),
    playCount: formatPlayCount(playCount),
  };
}

export function nomalizePlaylist(data) {
  let { id, name, picUrl, copywriter, playCount } = data;

  return {
    id,
    name,
    picUrl,
    copywriter,
    playCount: formatPlayCount(playCount),
  };
}

export function nomalizePlaylistDetail(data) {
  let { coverImgUrl, creator, createTime, description, name, tags } = data;

  return {
    creator,
    coverImgUrl,
    createTime,
    description,
    name,
    tags: (tags || []).map((e) => e).join("/"),
  };
}

export function getArtists(artists) {
  return (artists || []).map((e) => e.name).join("/");
}

function formatPlayCount(count) {
  if (count > 10000) {
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
    return addZero(years) + "年" + addZero(months) + "月" + addZero(day);
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
