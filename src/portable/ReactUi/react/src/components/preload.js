import React from 'react'

import Player from './Player'
import { FilePlayer } from './players/FilePlayer'

const PRELOAD_PLAYERS = [
{
    Player: FilePlayer,
    configKey: 'dailymotion',
    url: 'https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3'
  }
]

export default function renderPreloadPlayers (url, config) {
  const players = []

  for (let player of PRELOAD_PLAYERS) {
    if (!player.Player.canPlay(url) && config[player.configKey].preload) {
      players.push(
        <Player
          key={player.Player.displayName}
          activePlayer={player.Player}
          url={player.url}
          playing
          muted
          style={{ display: 'none' }}
        />
      )
    }
  }

  return players
}
