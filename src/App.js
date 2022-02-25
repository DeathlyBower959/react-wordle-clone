import styled from 'styled-components'
import { useState, useEffect } from 'react'

import PlayArea from './components/PlayArea'
import Keyboard from './components/Keyboard'
import GameFinish from './components/GameFinish'

import useNotification from './hooks/useNotification'

import WordContext from './contexts/WordContext'
import { decrypt, encrypt } from './utils/encrypt'

import possibleWords from './words/possibleWords.json'

import { window_confirm } from './constants/text.js'

function App() {
    const [words, setWords] = useState(
        JSON.parse(localStorage.getItem('words')) || ['']
    )
    const [isGameWon, setGameWon] = useState('')

    const [notifications, showNotification, hideNotification] =
        useNotification()

    const updateWord = (confirm = true) => {
        let chk = true
        if (confirm) chk = window.confirm(window_confirm)
        if (chk) {
            localStorage.setItem(
                'word',
                encrypt(
                    possibleWords[
                        Math.floor(Math.random() * possibleWords.length)
                    ]
                )
            )

            setWords([''])
            setGameWon('')
        }
    }

    const finishGame = state => {
        setGameWon(state)

        if (state == 'correct') {
            showNotification('Great Job!', 'gameWin', 3)
        } else if (state == 'wrong')
            showNotification(decrypt(localStorage.getItem('word')), 'gameWin')
    }

    useEffect(() => {
        if (isGameWon == '' || isGameWon.includes('disabled')) {
            hideNotification('gameWin')
        }
        if (isGameWon != '') {
            const unparsed = localStorage.getItem('stats')

            let word

            const encrypted = localStorage.getItem('word')
            if (encrypted) word = decrypt(encrypted)

            let stats = null
            if (!unparsed) {
                if (isGameWon == 'correct')
                    stats = [{ word, tries: words.length - 1 }]
                else if (isGameWon == 'wrong') stats = [{ word, tries: 0 }]
            } else {
                const parsed = JSON.parse(unparsed)
                if (parsed[parsed.length - 1].word == word) return

                if (isGameWon == 'correct')
                    stats = [...parsed, { word, tries: words.length - 1 }]
                else if (isGameWon == 'wrong')
                    stats = [...parsed, { word, tries: 0 }]
            }

            localStorage.setItem('stats', JSON.stringify(stats))
        }
    }, [isGameWon])

    const compareWord = () => {
        const encrypted = localStorage.getItem('word')
        if (!encrypted) updateWord(false)

        const word = decrypt(encrypted)
        console.log(word)

        if (words[words.length - 1] == '') {
            if (words[words.length - 2] == word) finishGame('correct')
            else if (words.length > 6) finishGame('wrong')
        }
    }

    useEffect(compareWord, [])

    useEffect(() => {
        localStorage.setItem('words', JSON.stringify(words))

        compareWord()
    }, [words])

    return (
        <WordContext.Provider value={words}>
            {notifications}

            <ReloadButton
                onClick={updateWord}
                width='30'
                height='30'
                viewBox='0 0 24 24'
                fill='none'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
            >
                <polyline points='1 4 1 10 7 10'></polyline>
                <polyline points='23 20 23 14 17 14'></polyline>
                <path d='M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'></path>
            </ReloadButton>
            <GameFinish
                isGameWon={isGameWon}
                updateWord={updateWord}
                close={() => {
                    setGameWon(prev => {
                        return prev + ':disabled'
                    })
                }}
            />
            <PlayArea />
            <Keyboard setWords={setWords} isGameWon={isGameWon} />
        </WordContext.Provider>
    )
}

const ReloadButton = styled.svg`
    position: absolute;
    stroke: #555;
    stroke-width: 1pt;
    cursor: pointer;
`

export default App
