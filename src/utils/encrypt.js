import letters from '../words/letters.json'

const scramble = text => {
    let scrambled = ''

    for (let i = 0; i < text.length; i++) {
        const upperCase = Math.random() < 0.5
        let letter = letters[Math.floor(Math.random() * 26)]
        if (upperCase) letter = letter.toUpperCase()

        scrambled += text[i] + letter
    }

    return scrambled
}

const unscramble = text => {
    let decrypted = ''
    for (let i = 0; i < text.length; i++) {
        if (i % 2 == 0) decrypted += text[i]
    }

    return decrypted
}

const iterations = 2

export const encrypt = text => {
    let final = text

    for (let i = 0; i < iterations; i++) {
        const encrypted = btoa(final)
        final = scramble(encrypted)
    }

    return final
}

export const decrypt = text => {
    if (!text) return ''
    let final = text

    for (let i = 0; i < iterations; i++) {
        const descramble = unscramble(final)
        final = atob(descramble)
    }

    return final
}
