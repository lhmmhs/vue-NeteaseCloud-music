export function nomalizeSong(data) {
  let {
    name,
    picUrl,
    song: { artists },
  } = data

  return {
    name,
    picUrl,
    artists: getArtists(artists),
  }
}

export function nomalizeMv(data) {
  let { name, picUrl, artists, playCount } = data

  return {
    name,
    picUrl,
    artists: getArtists(artists),
    playCount: formatPlayCount(playCount),
  }
}

export function nomalizePlaylist(data) {
  let { id, name, picUrl, copywriter, playCount } = data

  return {
    id,
    name,
    picUrl,
    copywriter,
    playCount: formatPlayCount(playCount),
  }
}

export function nomalizePlaylistDetail(data) {
  let { coverImgUrl, creator, createTime, description, name, tags } = data

  return {
    creator,
    coverImgUrl,
    createTime,
    description,
    name,
    tags: (tags || []).map((e) => e).join("/"),
  }
}

function getArtists(artists) {
  return (artists || []).map((e) => e.name).join("/")
}

function formatPlayCount(count) {
  if (count > 10000) {
    count = count / 10000 + ""
    return count.match(/\d+\.\d/)[0] + "万"
  } else {
    return count
  }
}

export function formatDate(timestamp) {
  let date = new Date(timestamp)
  let years = date.getFullYear()
  let months = date.getMonth() + 1
  let day = date.getDate()

  return addZero(years) + "-" + addZero(months) + "-" + addZero(day)
}

function addZero(n) {
  return n < 9 ? "0" + n : n + ""
}
