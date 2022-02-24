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
    const [isGameWon, setGameWon] = useState('')

    const updateWord = (confirm = true) => {
        let chk = true
        if (confirm)
            chk = window.confirm('Are you sure you want to reset the word?')
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

        const unparsed = localStorage.getItem('stats')

        let stats = null
        if (!unparsed) stats = [{ tries: words.length }]
        else stats = [...JSON.parse(unparsed), { tries: words.length }]

        localStorage.setItem('stats', JSON.stringify(stats))
    }

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
                updateWord={updateWord}
                isGameWon={isGameWon}
                close={() => {
                    setGameWon(prev => {
                        return prev + ':disabled'
                    })
                }}
            />
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
