import { useEffect, useState } from 'react'

const PREFIX = 'deathlybower959-wordle-clone-' // Adds prefix to all keys 


/**
 * Exported function that dynamically stores data in localstorage
 * @param {String} key Local storage key to save data to
 * @param initialValue Default starting value 
 */
export default function useLocalStorage(key, initialValue) {
  const prefixedKey = PREFIX + key
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixedKey)
    if (jsonValue !== null) return JSON.parse(jsonValue)
    if (typeof initialValue === 'function') {
      return initialValue()
    } else {
      return initialValue
    }
  })

  useEffect(() => {
    // console.log(`Saving ${prefixedKey} as data:\n${JSON.stringify(value)}`) // Used to display key and data in console (For debugging)
    localStorage.setItem(prefixedKey, JSON.stringify(value))
  }, [prefixedKey, value])

  return [value, setValue]
}