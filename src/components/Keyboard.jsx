import React from 'react'
import { useEffect, useContext, useCallback } from 'react'
import styled from 'styled-components'
import WordContext from '../contexts/WordContext'

import { decrypt } from '../utils/encrypt'

import possibleWords from '../words/possibleWords.json'

const Keyboard = ({ isGameWon, setWords }) => {
    const words = useContext(WordContext)

    const submitWord = useCallback(() => {
        setWords(prev => {
            if (!possibleWords.includes(prev[prev.length - 1])) return prev
            if (prev[prev.length - 1] === '') return prev

            return [...prev, '']
        })
    }, [])

    const handleClick = useCallback(
        key => {
            if (isGameWon != '') return

            setWords(p => {
                if (p?.length > 6) return p

                let prev = [...p]
                if (prev[prev.length - 1]?.length == 5) return prev

                prev[prev.length - 1] += key
                return [...prev]
            })
        },
        [isGameWon]
    )

    const deleteLetter = useCallback(() => {
        setWords(p => {
            let prev = [...p]
            if (prev[prev.length - 1]?.length == 0) return prev

            prev[prev.length - 1] = prev[prev.length - 1].slice(0, -1)
            return [...prev]
        })
    }, [])

    const calculateKeyState = key => {
        const word = decrypt(localStorage.getItem('word'))

        let obj = {}

        words.forEach((w, col) => {
            for (let row = 0; row < word.length; row++) {
                const letter = w && w[row]

                if (
                    letter == '' ||
                    letter == undefined ||
                    words[col + 1] == undefined
                )
                    continue

                if (word[row] == letter) obj[letter] = 'correct'
                else if (word.includes(letter)) obj[letter] = 'wrongLoc'
                else obj[letter] = 'wrong'
            }
        })

        return obj[key]
    }

    useEffect(() => {
        const handleKeyPress = e => {
            if (e.key == 'Enter') {
                submitWord()
            } else if (e.key == 'Backspace' || e.key === 'Delete') {
                deleteLetter()
            } else if (e.key.match(/^[a-z]$/)) {
                handleClick(e.key.toLowerCase())
            }
        }

        document.addEventListener('keydown', handleKeyPress)

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [isGameWon])

    return (
        <StyledKeyboard>
            {Keys.map((x, i) => {
                if (x == '') return <div key={i} className='space'></div>

                if (x == 'enter')
                    return (
                        <Key key={i} onClick={submitWord} large>
                            {x}
                        </Key>
                    )

                if (x == 'delete')
                    return (
                        <Key onClick={deleteLetter} key={i} large>
                            <KeyIcon
                                xmlns='http://www.w3.org/2000/svg'
                                height='24'
                                viewBox='0 0 24 24'
                                width='24'
                            >
                                <path d='M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z'></path>
                            </KeyIcon>
                        </Key>
                    )
                return (
                    <Key
                        onClick={() => handleClick(x)}
                        key={i}
                        state={calculateKeyState(x)}
                    >
                        {x}
                    </Key>
                )
            })}
        </StyledKeyboard>
    )
}

const StyledKeyboard = styled.div`
    display: grid;
    grid-template-columns: repeat(20, minmax(auto, 1.25em));
    grid-auto-rows: 3em;
    gap: 0.25em;
    justify-content: center;
`

const Key = styled.div`
    font-size: inherit;
    grid-column: span ${props => (props.large ? 3 : 2)};
    border: none;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: ${props =>
        props.state == 'correct'
            ? '#538d4e'
            : props.state == 'wrongLoc'
            ? '#b59f3b'
            : props.state == 'wrong'
            ? '#3a3a3c'
            : '#818384'};

    color: white;
    fill: white;
    text-transform: uppercase;
    border-radius: 0.25em;
    cursor: pointer;
    user-select: none;

    transition: filter 175ms ease-out, background-color 100ms ease-out;

    &:hover {
        filter: brightness(1.2);
    }
`

const KeyIcon = styled.svg`
    width: 1.75em;
    height: 1.75em;
`

const Keys = [
    'q',
    'w',
    'e',
    'r',
    't',
    'y',
    'u',
    'i',
    'o',
    'p',
    '',
    'a',
    's',
    'd',
    'f',
    'g',
    'h',
    'j',
    'k',
    'l',
    '',
    'enter',
    'z',
    'x',
    'c',
    'v',
    'b',
    'n',
    'm',
    'delete',
]

export default Keyboard
