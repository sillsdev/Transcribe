import * as React from 'react'

function Duration ({seconds} : {seconds: any}) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`}>
      {format(seconds)}
    </time>
  )
}

function format (seconds: any) {
  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(date.getUTCSeconds())
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`
  }
  return `${mm}:${ss}`
}

function pad (text: any) {
  return ('0' + text).slice(-2)
}

export default Duration
