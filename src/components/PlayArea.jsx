import { useContext, useCallback } from 'react'
import styled from 'styled-components'
import WordContext from '../contexts/WordContext'
import { decrypt } from '../utils/encrypt'

import possibleWords from '../words/words.js'

const PlayArea = ({ wordLength }) => {
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
                const times = (n, iterator) => {
                    var accum = Array(Math.max(0, n))
                    for (var i = 0; i < n; i++) accum[i] = iterator
                    return accum
                }

                if (!states[col]) states.push(times(wordLength, 'w').join(''))

                if (word[row] == letter) {
                    states[col] = replaceAt(states[col], row, 'c')
                } else if (word.includes(letter)) {
                    states[col] = replaceAt(states[col], row, 'l')
                }

                const replaceAtIndex = i => {
                    if (i < 0) return word
                    return word.substr(0, i) + '.' + word.substr(i + 1)
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

            if (!letter || words[col]?.length < wordLength) return

            if (!possibleWords[`words${wordLength}`].includes(words[col]))
                return `shake 250ms ease-in-out`

            const word = decrypt(localStorage.getItem('word'))

            if (words[col]?.length < wordLength || words[col + 1] == undefined)
                return

            if (words[col] == word)
                return `dance 750ms ease-in-out ${row * 100}ms`

            if (words.includes(word)) return
            return `flip 500ms linear ${row * 100}ms`
        },
        [words, possibleWords, decrypt]
    )

    return (
        <GuessingGrid columns={wordLength}>
            {[...Array(6)].map((_, col) => {
                return [...Array(wordLength)].map((_, row) => {
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
    grid-template-columns: ${props => `repeat(${props.columns}, minmax(2rem, 6rem))`};
    grid-template-rows: repeat(6, minmax(2rem, 6rem));

    /* @media only screen and (max-width: 900px) {
        grid-template-columns: ${props =>
            `repeat(${props.columns}, minmax(auto, 10vw))`};
        grid-template-rows: repeat(6, minmax(auto, 10vw));
    } */

    gap: 0.25em;
    margin-bottom: 1em;
`

const Tile = styled.div`
    font-size: clamp(2rem, 2em, 6rem);
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
            ? props.theme.keys.correct
            : props.state == 'l'
            ? props.theme.keys.wrongLoc
            : props.state == 'w'
            ? props.theme.keys.wrong
            : ''};
`

export default PlayArea
