import styled from 'styled-components'

import { useState } from 'react'

const Notification = () => {
    const [notifications, setNotifications] = useState([])

    const showNotification = (msg, id, time = 0) => {
        setNotifications(prev => {
            if (prev.filter(x => x.id == id)?.length > 0) {
                console.error(
                    `Notification with the id '${id}' already exists!`
                )

                return prev
            }

            return [
                ...prev,
                {
                    msg,
                    id,
                },
            ]
        })

        if (time <= 0) return
        setTimeout(() => {
            setNotifications(prev => {
                return [...prev.filter(x => x.id != id)]
            })
        }, time * 1000)
    }

    const hideNotification = id => {
        setNotifications(prev => {
            if (prev.filter(x => x.id == id).length < 0) {
                console.error(`Notification with the id '${id}' doesn't exist!`)
                return prev
            }

            return [...prev.filter(x => x.id != id)]
        })
    }

    return [
        <NotificationWrapper>
            {notifications.map((notif, index) => {
                return (
                    <NotificationBox key={index + notif.id} index={index}>
                        {notif.msg}
                    </NotificationBox>
                )
            })}
        </NotificationWrapper>,
        showNotification,
        hideNotification,
    ]
}

const NotificationBox = styled.div`
    background-color: ${props => props.theme.notification.bg};
    color: ${props => props.theme.notification.color};

    padding: 1em 2em;
    border-radius: 15px;
    text-align: center;
    margin-bottom: 1em;

    animation: moveDown 1s ease-in-out forwards;

    @keyframes moveDown {
        from {
            transform: scale(0);
        }

        to {
            transform: scale(1);
        }
    }
`

const NotificationWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;

    position: fixed;
    top: 5%;
    left: 0;
    right: 0;
    height: min-content;
    pointer-events: none;

    z-index: 9999;
`

export default Notification
