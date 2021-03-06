'use strict'

const wordsData = require('./words.json')

const allWords = Object.values(wordsData).reduce((o, i) => o.concat(i), [])

const normalizePinyin = (pinyin) => pinyin.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/(\w)[1-5]/g, '$1').toLowerCase()

const split = (text, everything=false, wrapInList=false) => {
  const list = []
  let prevWordFound = false
  let wordEnd = text.length
  while (wordEnd > 0) {
    let count = wordEnd
    let wordFound = false
    while (count > 0) {
      const word = text.substring(wordEnd - count, wordEnd)
      if (allWords.includes(normalizePinyin(word))) {
        wordFound = true
        list.push(wrapInList ? [word] : word)
        wordEnd -= (count - 1)
        break
      }
      count--
    }
    if (!wordFound && everything) {
      const prevIndex = list.length - 1
      const prevEntry = list[prevIndex]
      if (wordEnd === text.length || typeof prevEntry === 'object' || prevWordFound) {
        list.push(text[wordEnd - 1])
      }
      else if (typeof prevEntry === 'string') {
        list[prevIndex] = text[wordEnd - 1] + prevEntry
      }
    }
    wordEnd --
    prevWordFound = wordFound
  }
  return list.reverse()
}

module.exports = split
