import { useContext, useCallback } from 'react'
import styled from 'styled-components'
import WordContext from '../contexts/WordContext'
import { decrypt } from '../utils/encrypt'

import possibleWords from '../words/possibleWords.json'

const PlayArea = () => {
    const words = useContext(WordContext)

    const getTileState = useCallback(
        (col, row) => {
            const word = decrypt(localStorage.getItem('word'))
            const letter = words[col] && words[col][row]

            if (!letter || words[col + 1] == undefined) return

            if (word[row] == letter) return 'correct'
            if (word.includes(letter)) return 'wrongLoc'
            return 'wrong'
        },
        [words, decrypt]
    )

    const calcTileAnimation = useCallback(
        (col, row) => {
            const letter = words[col] && words[col][row]

            if (!letter || words[col]?.length < 5) return

            if (!possibleWords.includes(words[col]))
                return `shake 250ms ease-in-out`

            const word = decrypt(localStorage.getItem('word'))
            if (words[col]) {
                if (words[col] == word)
                    return `dance 750ms ease-in-out ${row * 100}ms`
            }

            if (words.includes(word)) return
            if (words[col]?.length < 5 || words[col + 1] == undefined) return

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
                            state={getTileState(col, row)}
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
        props.state == 'correct'
            ? '#538d4e'
            : props.state == 'wrongLoc'
            ? '#b59f3b'
            : props.state == 'wrong'
            ? '#818384'
            : ''};
`

export default PlayArea
