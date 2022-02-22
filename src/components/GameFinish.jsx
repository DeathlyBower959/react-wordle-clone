import styled from 'styled-components'

const GameFinish = () => {
    return (
        <DivContainer id='test'>
            <ElementDiv>
                <CloseIcon
                    onClick={() => {
                        document.getElementById('test').style.display = 'none'
                    }}
                >
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
            </ElementDiv>
        </DivContainer>
    )
}

const CloseIcon = styled.div`
    width: 24px;
    height: 24px;
    margin-left: auto;
    margin-right: 0;

    cursor: pointer;
`
const DivContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;

    z-index: 999;

    /* this is what centers your element in the fixed wrapper*/
    display: flex;
    flex-flow: column nowrap;
    justify-content: center; /* aligns on vertical for column */
    align-items: center; /* aligns on horizontal for column */
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
`

export default GameFinish
