import styled, { ThemeContext } from 'styled-components'
import { useContext } from 'react'

import possibleWords from '../words/words.js'

const SettingsPage = ({
    close,
    setWordLength,
    wordLength,
    isSettingsOpen,
    toggleTheme,
}) => {
    const theme = useContext(ThemeContext)

    return (
        <DivContainer isSettingsOpen={isSettingsOpen}>
            <ElementDiv>
                <CloseIcon onClick={close}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        height='24'
                        viewBox='0 0 24 24'
                        width='24'
                    >
                        <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'></path>
                    </svg>
                </CloseIcon>

                <InnerDiv>
                    <UpperDiv>
                        <Header>Settings</Header>
                        <SettingWrapper>
                            <SettingTitle>Word Length</SettingTitle>
                            <NumberContainer>
                                <span
                                    className='next'
                                    onClick={() =>
                                        setWordLength(wordLength + 1)
                                    }
                                ></span>
                                <span
                                    className='prev'
                                    onClick={() =>
                                        setWordLength(wordLength - 1)
                                    }
                                ></span>
                                <Box>
                                    <span>{wordLength}</span>
                                </Box>
                            </NumberContainer>
                            <NoteText>
                                Possible Words:{' '}
                                {possibleWords[`words${wordLength}`]?.length ||
                                    '0'}
                            </NoteText>

                            <SettingTitle>Dark Mode</SettingTitle>
                            <SwitchWrapper>
                                <SwitchInput checked={theme.id == 'dark'} />
                                <Slider onClick={toggleTheme} />
                            </SwitchWrapper>
                        </SettingWrapper>
                    </UpperDiv>
                </InnerDiv>
            </ElementDiv>
        </DivContainer>
    )
}

const Slider = styled.span.attrs({ className: 'slider' })`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;

    border-radius: 34px;

    &:before {
        position: absolute;
        content: '';
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: 0.4s;
        transition: 0.4s;
        border-radius: 50%;
    }
`

const SwitchInput = styled.input.attrs({ type: 'checkbox' })`
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
        background-color: ${props => props.theme.accent};
    }

    &:focus + .slider {
        box-shadow: 0 0 1px ${props => props.theme.accent};
    }

    &:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }
`

const SwitchWrapper = styled.label`
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
`

const NoteText = styled.p`
    color: ${props => props.theme.muted};
    font-size: 15px;
`

const SettingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
`

const SettingTitle = styled.h4`
    color: white;
    margin-bottom: 0.5em;
`

const NumberContainer = styled.div`
    position: relative;
    width: 80px;
    height: 50px;
    border-radius: 40px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    transition: 0.5s;

    &:hover {
        width: 120px;
        border: 2px solid rgba(255, 255, 255, 1);
    }

    &:hover .next {
        opacity: 1;
        right: 20px;
    }

    .next {
        position: absolute;
        top: 50%;
        right: 30px;
        display: block;
        width: 12px;
        height: 12px;
        border-top: 2px solid white;
        border-left: 2px solid white;
        z-index: 1;
        transform: translateY(-50%) rotate(135deg);
        cursor: pointer;
        opacity: 0;
        transition: 0.5s;
    }

    &:hover .prev {
        opacity: 1;
        left: 20px;
    }

    .prev {
        position: absolute;
        top: 50%;
        left: 30px;
        display: block;
        width: 12px;
        height: 12px;
        border-top: 2px solid white;
        border-left: 2px solid white;
        z-index: 1;
        transform: translateY(-50%) rotate(315deg);
        cursor: pointer;
        opacity: 0;
        transition: 0.5s;
    }

    &:hover div span {
        color: white;
    }
`

const Box = styled.div`
    span {
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 46px;
        color: ${props => props.theme.faded};
        font-size: 25px;
        font-weight: 700;
        user-select: none;

        transition: 0.5s;
    }
`

const UpperDiv = styled.div``

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
    color: ${props => props.theme.faded};
    text-align: center;

    margin-bottom: 0;

    font-size: 21px;
`

const CloseIcon = styled.div`
    width: 24px;
    height: 24px;
    margin-right: 16px;

    cursor: pointer;
    pointer-events: all;

    position: absolute;
    right: 0;

    svg path {
        fill: ${props => props.theme.foreground};
    }
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

    opacity: ${props => (props.isSettingsOpen ? '1' : '0')};

    pointer-events: ${props => (props.isSettingsOpen ? 'all' : 'none')};
`

const ElementDiv = styled.div`
    width: 90%;
    height: min-content;

    max-height: 90%;
    max-width: 550px;

    padding: 16px;
    background-color: ${props => props.theme.secondaryBackground};
    border: 1px solid ${props => props.theme.darkBorder};
    border-radius: 8px;
    box-shadow: 0px 0px 20px #171718;

    transition: opacity 350ms ease-in-out;

    position: relative;
`

export default SettingsPage
