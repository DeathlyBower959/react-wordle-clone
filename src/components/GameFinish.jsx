import styled from 'styled-components'

import { LineChart, Line, XAxis, YAxis } from 'recharts'
import { useContext } from 'react'
import WordContext from '../contexts/WordContext'
import { decrypt } from '../utils/encrypt'

const data = [
    {
        tries: 3,
    },
    {
        tries: 2,
    },
    {
        tries: 6,
    },
    {
        tries: 1,
    },
]

const GameFinish = ({ isGameWon, close, updateWord }) => {
    const words = useContext(WordContext)

    return (
        <DivContainer isGameWon={isGameWon}>
            <ElementDiv isGameWon={isGameWon}>
                <CloseIcon onClick={close}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        height='24'
                        viewBox='0 0 24 24'
                        width='24'
                    >
                        <path
                            fill='#fff'
                            d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
                        ></path>
                    </svg>
                </CloseIcon>

                <InnerDiv>
                    <UpperDiv>
                        <Header>Statistics</Header>
                        <StatsWrapper>
                            <Stat>
                                <StatNumber>1</StatNumber>
                                <StatText>Played</StatText>
                            </Stat>

                            <Stat>
                                <StatNumber>0</StatNumber>
                                <StatText>Win %</StatText>
                            </Stat>

                            <Stat>
                                <StatNumber>0</StatNumber>
                                <StatText>Streak</StatText>
                            </Stat>

                            <Stat>
                                <StatNumber>0</StatNumber>
                                <StatText>Max Streak</StatText>
                            </Stat>
                        </StatsWrapper>
                    </UpperDiv>
                    <GraphWrapper>
                        <LineChart width={400} height={180} data={data}>
                            <Line
                                type='monotone'
                                dataKey='tries'
                                stroke='#8888ff'
                            />
                            <XAxis />
                            <YAxis />
                        </LineChart>
                    </GraphWrapper>

                    <ButtonWrapper>
                        <Button
                            onClick={() => {
                                updateWord(false)
                            }}
                        >
                            Restart
                        </Button>
                        <Button
                            onClick={() => {
                                let string = `Wordle ${words.length - 1}/6\n\n`
                                const word = decrypt(
                                    localStorage.getItem('word')
                                )

                                const loadWord = x => {
                                    for (let row = 0; row < x.length; row++) {
                                        if (word[row] == x[row]) string += '🟩'
                                        else if (word.includes(x[row]))
                                            string += '🟨'
                                        else string += '⬛'
                                    }
                                    string += '\n'
                                }

                                words.forEach(x => {
                                    loadWord(x)
                                })

                                navigator.clipboard.writeText(string.trimEnd())
                            }}
                        >
                            Share
                        </Button>
                    </ButtonWrapper>
                </InnerDiv>
            </ElementDiv>
        </DivContainer>
    )
}

const UpperDiv = styled.div``

const StatsWrapper = styled.div`
    display: flex;
    justify-content: center;
`

const Stat = styled.div`
    margin: 0 1em;
    width: 3rem;
`

const StatNumber = styled.h1`
    color: white;
    margin-bottom: 0;

    font-size: 30px;
`

const StatText = styled.p`
    color: #ccc;
    margin-top: 0.2rem;

    font-size: 14px;
`

const GraphWrapper = styled.div``

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    width: 40%;
`

const Button = styled.button`
    padding: 1em;
    margin: 5px 0;
    border-radius: 8px;

    border: 1px solid #434343;
    background-color: #232323;

    color: #c9c9c9;
    font-size: 1rem;

    cursor: pointer;

    transition: filter 350ms ease-out;

    &:hover {
        filter: brightness(1.2);
    }
`

const InnerDiv = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    text-align: center;
    width: 100%;

    height: 95%;
`

const Header = styled.h2`
    color: #dbdbdb;
    text-align: center;

    margin-bottom: 0;

    font-size: 21px;
`

const CloseIcon = styled.div`
    width: 24px;
    height: 24px;
    margin-left: auto;
    margin-right: 0;

    cursor: pointer;
    pointer-events: all;
`

const DivContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;

    z-index: 999;

    user-select: none;
    -webkit-user-drag: none;

    transition: opacity 350ms ease-in-out;

    display: flex;
    flex-flow: column nowrap;
    justify-content: center; /* aligns on vertical for column */
    align-items: center; /* aligns on horizontal for column */

    backdrop-filter: brightness(0.6);

    opacity: ${props =>
        props.isGameWon.includes('disabled') || props.isGameWon == ''
            ? '0'
            : props.isGameWon.includes('correct') ||
              props.isGameWon.includes('wrong')
            ? '1'
            : '0'};

    pointer-events: ${props =>
        props.isGameWon.includes('disabled') || props.isGameWon == ''
            ? 'none'
            : props.isGameWon.includes('correct') ||
              props.isGameWon.includes('wrong')
            ? 'all'
            : 'none'};
`

const ElementDiv = styled.div`
    width: 90%;
    height: 50%;

    max-height: 90%;
    max-width: 507px;

    padding: 16px;
    background-color: #121213;
    border: 1px solid #1a1a1b;
    border-radius: 8px;
    box-shadow: 0px 0px 20px #171718;

    transition: opacity 350ms ease-in-out;

    ${props => console.log(props.isGameWon)}
`

export default GameFinish
