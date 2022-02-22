import PlayArea from './components/PlayArea'
import Keyboard from './components/Keyboard'
import { useState, useEffect } from 'react'
import styled from 'styled-components'

import WordContext from './contexts/WordContext'
import { decrypt, encrypt } from './utils/encrypt'

import possibleWords from './words/possibleWords.json'
import GameFinish from './components/GameFinish'

function App() {
    const [words, setWords] = useState(
        JSON.parse(localStorage.getItem('words')) || ['']
    )
    const [isGameWon, setGameWon] = useState(false)

    const updateWord = (confirm = true) => {
        let chk = confirm;
        if (confirm) chk = window.confirm('Are you sure you want to reset the word?')
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
        }
    }

    const finishGame = () => {
        setGameWon(true)
    }

    useEffect(() => {
        const word = decrypt(localStorage.getItem('word'))
        if (!word) updateWord(false)
        console.log(word)
        if (words[words.length - 2] == word && words[words.length - 1] == '')
            finishGame()
    }, [])

    useEffect(() => {
        localStorage.setItem('words', JSON.stringify(words))

        const word = decrypt(localStorage.getItem('word'))
        if (words[words.length - 2] == word && words[words.length - 1] == '')
            finishGame()
    }, [words])

    return (
        <WordContext.Provider value={words}>
            <ReloadButton
                onClick={updateWord}
                xmlns='http://www.w3.org/2000/svg'
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
            {isGameWon && <GameFinish />}
            <PlayArea />
            <Keyboard setWords={setWords} />
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
