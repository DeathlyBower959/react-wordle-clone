import React from 'react'
import { useEffect, useContext } from 'react'
import styled from 'styled-components'

import possibleWords from '../words/possibleWords.json'

const Keyboard = ({ setWords }) => {
    const submitWord = () => {
        setWords(prev => {
            if (!possibleWords.includes(prev[prev.length - 1])) return prev
            if (prev[prev.length - 1] === '') return prev

            return [...prev, '']
        })
    }

    const handleClick = key => {
        setWords(p => {
            console.log('WordLength',p.length)
            if (p?.length > 5) return
            let prev = [...p]
            if (prev[prev.length - 1]?.length == 5) return prev

            prev[prev.length - 1] += key
            return [...prev]
        })
    }

    const deleteLetter = () => {
        setWords(p => {
            let prev = [...p]
            if (prev[prev.length - 1]?.length == 0) return prev

            prev[prev.length - 1] = prev[prev.length - 1].slice(0, -1)
            return [...prev]
        })
    }

    useEffect(() => {
        const handleKeyPress = e => {
            if (e.key === 'Enter') {
                submitWord()
                return
            }

            if (e.key === 'Backspace' || e.key === 'Delete') {
                deleteLetter()
                return
            }

            if (e.key.match(/^[a-z]$/)) {
                handleClick(e.key)
                return
            }
        }
        document.removeEventListener('keydown', handleKeyPress)

        document.addEventListener('keydown', handleKeyPress)
    }, [])

    return (
        <StyledKeyboard dataKeyboard>
            {Keys.map((x, i) => {
                if (x == '') return <div key={i} className='space'></div>

                if (x == 'Enter')
                    return (
                        <Key key={i} onClick={submitWord} data-enter large>
                            {x}
                        </Key>
                    )

                if (x == 'delete')
                    return (
                        <Key onClick={deleteLetter} key={i} data-delete large>
                            <KeyIcon
                                xmlns='http://www.w3.org/2000/svg'
                                height='24'
                                viewBox='0 0 24 24'
                                width='24'
                            >
                                <path
                                    fill='var(--color-tone-1)'
                                    d='M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z'
                                ></path>
                            </KeyIcon>
                        </Key>
                    )
                return (
                    <Key onClick={() => handleClick(x)} key={i}>
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

    transition: filter 175ms ease-out;

    &:hover {
        filter: brightness(1.2);
    }
`

const KeyIcon = styled.svg`
    width: 1.75em;
    height: 1.75em;
`

const Keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    '',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    '',
    'Enter',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'delete',
]

export default Keyboard
