import { useContext } from 'react'
import styled from 'styled-components'
import WordContext from '../contexts/WordContext'
import { decrypt } from '../utils/encrypt'

import possibleWords from '../words/possibleWords.json'

const PlayArea = () => {
    const words = useContext(WordContext)

    const word = decrypt(localStorage.getItem('word'))

    const getTileState = (col, row) => {
        const letter = words[col] && words[col][row]

        if (letter == '' || letter == undefined || words[col + 1] == undefined)
            return
        if (word[row] == letter) return 'correct'
        if (word.includes(letter)) return 'wrongLoc'
        return 'wrong'
    }

    const calcClassName = (col, row) => {
        const letter = words[col] && words[col][row]

        if (letter == '' || letter == undefined || words[col]?.length < 5)
            return

        if (!possibleWords.includes(words[col])) return 'shake'

        if (words[col + 1] == undefined) return

        // setTimeout(() => {
        //     document.getElementById(`${col}:${row}`).classList.add('flip')
        // }, row * 250)

        // setTimeout(() => {
        //     document.getElementById(`${col}:${row}`).classList.remove('flip')
        // }, row * 250 + 500)
    }

    const calcTileStates = (col, row) => {
        if (words[col]?.length < 5) return

        if (words[col + 1] == undefined) return

        const tile = document.getElementById(`${col}:${row}`)

        if (!tile) return

        tile.style.animation = `flip 500ms linear ${row * 100}ms`
    }

    return (
        <GuessingGrid>
            {[...Array(6)].map((_, col) => {
                return [...Array(5)].map((_, row) => {
                    calcTileStates(col, row)
                    return (
                        <Tile
                            key={`${col}:${row}`}
                            id={`${col}:${row}`}
                            className={calcClassName(col, row)}
                            state={getTileState(col, row)}
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
