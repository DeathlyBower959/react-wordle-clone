import { useContext, useCallback } from 'react'
import styled from 'styled-components'
import WordContext from '../contexts/WordContext'
import { decrypt } from '../utils/encrypt'

import possibleWords from '../words/possibleWords.json'

const PlayArea = () => {
    const words = useContext(WordContext)

    const replaceAt = useCallback((string, index, replacement) => {
        if (index >= string.length) {
            return string.valueOf()
        }

        return (
            string.substring(0, index) +
            replacement +
            string.substring(index + 1)
        )
    }, [])

    const getTileStates = useCallback(() => {
        var states = []
        
        words.forEach((guess, col) => {
            let word = decrypt(localStorage.getItem('word'))

            if (words[col + 1] == undefined) return

            guess.split('')?.forEach((letter, row) => {
                if (!states[col]) states.push('wwwww')

                console.log(word[row])

                if (word[row] == letter) {
                    states[col] = replaceAt(states[col], row, 'c')
                } else if (word.includes(letter)) {
                    states[col] = replaceAt(states[col], row, 'l')
                }

                const replaceAtIndex = i => {
                    if (i < 0) return word
                    return (
                        word.substr(0, i) +
                        '.' +
                        word.substr(i + 1)
                    )
                }
                word = replaceAtIndex(word.indexOf(letter))
            })
            // const letter = words[col] && words[col][row]

            // if (!letter || words[col + 1] == undefined) return

            // if (word[row] == letter) return 'correct'
            // if (word.includes(letter)) return 'wrongLoc'
            // return 'wrong'
        })

        return states
    }, [words, decrypt])

    const calcTileAnimation = useCallback(
        (col, row) => {
            const letter = words[col] && words[col][row]

            if (!letter || words[col]?.length < 5) return

            if (!possibleWords.includes(words[col]))
                return `shake 250ms ease-in-out`

            const word = decrypt(localStorage.getItem('word'))

            if (words[col]?.length < 5 || words[col + 1] == undefined) return

            if (words[col] == word)
                return `dance 750ms ease-in-out ${row * 100}ms`

            if (words.includes(word)) return
            return `flip 500ms linear ${row * 100}ms`
        },
        [words, possibleWords, decrypt]
    )

    return (
        <GuessingGrid>
            {[...Array(6)].map((_, col) => {
                return [...Array(5)].map((_, row) => {
                    return (
                        <Tile
                            key={`${col}:${row}`}
                            id={`${col}:${row}`}
                            state={
                                getTileStates()[col] &&
                                getTileStates()[col][row]
                            }
                            style={{ animation: calcTileAnimation(col, row) }}
                        >
                            {words[col] && words[col][row]}
                        </Tile>
                    )
                })
            })}
        </GuessingGrid>
    )
}

const GuessingGrid = styled.div`
    display: grid;
    justify-content: center;
    align-content: center;
    flex-grow: 1;
    grid-template-columns: repeat(5, 4em);
    grid-template-rows: repeat(6, 4em);
    gap: 0.25em;
    margin-bottom: 1em;
`

const Tile = styled.div`
    font-size: 2em;
    color: white;
    border: 0.05em solid hsl(240, 2%, 23%);
    text-transform: uppercase;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    transition: transform 250ms linear;

    background-color: ${props =>
        props.state == 'c'
            ? '#538d4e'
            : props.state == 'l'
            ? '#b59f3b'
            : props.state == 'w'
            ? '#818384'
            : ''};
`

export default PlayArea
