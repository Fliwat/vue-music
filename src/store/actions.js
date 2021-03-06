import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

export const selectPlay = ({ commit, state }, { list, index }) => {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

export const randomPlay = ({ commit }, { list }) => {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = ({ commit, state }, song) => {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let currentSong = playList[currentIndex]

  // 找到插入歌曲在播放列表的位置
  let fpIndex = findIndex(playList, song)
  // 插入歌曲索引加一
  currentIndex++
  // 将新歌曲插入播放列表
  playList.splice(currentIndex, 0, song)
  // 原来播放列表中存在歌曲
  if (fpIndex > -1) {
    if (fpIndex < currentIndex) {
      // 原来歌曲在前面，删除歌曲，索引减一
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      // 原来歌曲在后面，索引加一删除
      playList.splice(fpIndex + 1, 1)
    }
  }

  // 当前播放歌曲的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  // 原来歌曲的位置
  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (fsIndex < currentIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = ({ commit }, query) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = ({ commit }, query) => {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = ({ commit }) => {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = ({ commit, state }, song) => {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playList.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = ({ commit }) => {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = ({ commit }, song) => {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = ({ commit }, song) => {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = ({ commit }, song) => {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
