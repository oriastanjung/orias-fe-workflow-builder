/**
 * This function is used to dispatch custom event on local storage change
 * since built in storage event does not support fire and listen on the same tab
 * 
 * @param key local storage key
 * @param value value to be binded with the corresponding key
 */
export const setLocalStorageItem = (key: string, value: string) => {
    localStorage.setItem(key, value)
    window.dispatchEvent(new CustomEvent('localstorage-changed', { detail: { key, action: 'set', value } }))
}

/**
 * This function is used to dispatch custom event on local storage change
 * since built in storage event does not support fire and listen on the same tab
 * 
 * @param key local storage key
 * @param value value to be binded with the corresponding key
 */
export const removeLocalStorageItem = (key: string) => {
    localStorage.removeItem(key)
    window.dispatchEvent(new CustomEvent('localstorage-changed', { detail: { key, action: 'remove' } }))
}