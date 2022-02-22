import letters from '../words/letters.json'

export const encrypt = text => {
    const encrypted = btoa(text)
    let superEncrypted = ''
    for (let i = 0; i < encrypted.length; i++) {
        const upperCase = Math.random() < 0.5
        let letter = letters[Math.floor(Math.random() * 26)]
        if (upperCase) letter = letter.toUpperCase()

        superEncrypted += encrypted[i] + letter
    }

    return superEncrypted
}

export const decrypt = data => {
    if (!data) return
    let decrypted = ''


    for (let i = 0; i < data.length; i++) {
        if (i % 2 == 0) decrypted += data[i]
    }

    return atob(decrypted)
}
