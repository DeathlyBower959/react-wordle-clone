import styled, { ThemeProvider } from 'styled-components'
import { useState, useEffect, useCallback } from 'react'

import PlayArea from './components/PlayArea'
import Keyboard from './components/Keyboard'
import GameFinish from './components/GameFinish'
import SettingsPage from './components/SettingsPage'

import useNotification from './hooks/useNotification'

import WordContext from './contexts/WordContext'
import { decrypt, encrypt } from './utils/encrypt'
import useLocalStorage from './hooks/useLocalStorage'

import themes from './constants/colors.json'

import possibleWords from './words/words.js'

import {
    success_messages,
    window_confirm,
    word_length_change_confirm,
} from './constants/text.js'

function App() {
    const [words, setWords] = useLocalStorage('words', [''])
    const [wordLength, setWordLength] = useLocalStorage('wordLength', 5)
    const [settings, setSettings] = useLocalStorage('settings', {})
    const [theme, setTheme] = useLocalStorage('theme', themes.dark)

    const toggleTheme = () => {
        setTheme(prevTheme => {
            if (prevTheme.id == 'dark') return themes.light
            return themes.dark
        })
    }

    const updateWordLength = length => {
        if (words.length > 1) {
            if (!window.confirm(word_length_change_confirm)) return
            else setWords([''])
        }

        if (possibleWords[`words${length}`]) setWordLength(length)
        else
            console.error(
                'Failed to update word length, length was not found! | ' +
                    length
            )
    }

    const [isSettingsOpen, setSettingsOpen] = useState(false)

    const [isGameWon, setGameWon] = useState('')

    const [notifications, showNotification, hideNotification] =
        useNotification()

    const updateWord = useCallback(
        (confirm = true, newLength = null) => {
            let chk = true
            if (confirm) chk = window.confirm(window_confirm)
            if (chk) {
                const posWord = possibleWords[`words${newLength || wordLength}`]

                if (!posWord)
                    return console.error(
                        `Sorry, I couldn't find the file words${
                            newLength || wordLength
                        }`
                    )

                localStorage.setItem(
                    'word',
                    encrypt(posWord[Math.floor(Math.random() * posWord.length)])
                )

                setWords([''])
                setGameWon('')
            }
        },
        [window_confirm, possibleWords, wordLength]
    )

    useEffect(() => {
        if (!possibleWords[`words${wordLength}`]) updateWordLength(5)
        else if (words.length == 1) updateWord(false)
    }, [wordLength])

    const finishGame = state => {
        setGameWon(state)

        if (state == 'correct') {
            showNotification(success_messages[words.length - 2], 'gameWin', 3)
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

    useEffect(compareWord, [words])

    return (
        <WordContext.Provider value={words}>
            <ThemeProvider theme={theme}>
                {notifications}

                <BodyBackground />

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
                <SettingsButton
                    onClick={() => setSettingsOpen(true)}
                    width='30'
                    height='30'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                >
                    <circle cx='12' cy='12' r='3'></circle>
                    <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'></path>
                </SettingsButton>
                <GameFinish
                    isGameWon={isGameWon}
                    updateWord={updateWord}
                    close={() => {
                        setGameWon(prev => {
                            return prev + ':disabled'
                        })
                    }}
                />
                <SettingsPage
                    isSettingsOpen={isSettingsOpen}
                    toggleTheme={toggleTheme}
                    setWordLength={updateWordLength}
                    wordLength={wordLength}
                    close={() => {
                        setSettingsOpen(false)
                    }}
                />
                <PlayArea wordLength={wordLength} />
                <Keyboard
                    wordLength={wordLength}
                    setWords={setWords}
                    isGameWon={isGameWon}
                />
            </ThemeProvider>
        </WordContext.Provider>
    )
}

const ReloadButton = styled.svg`
    position: absolute;
    stroke: ${props => props.theme.icon};
    stroke-width: 1pt;
    cursor: pointer;
`

const SettingsButton = styled.svg`
    position: absolute;
    stroke: ${props => props.theme.icon};
    stroke-width: 1pt;
    cursor: pointer;
    right: 1%;
`

const BodyBackground = styled.div`
    position: fixed;
    z-index: -1;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;

    background-color: ${props => props.theme.background};
`

export default App
