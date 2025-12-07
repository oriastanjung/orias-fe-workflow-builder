import React from 'react'

import { setLocalStorageItem } from '@/lib/storage'

const useLocalStorageWatcher = (key: string) => {
    const [value, setValue] = React.useState<string | null>(null)
  
    React.useEffect(() => {
        // NOTE: direct set on state initialization does not work, idk why, need to figure it out later.
        // in alternative, set value on mount and every key change
        setValue(localStorage.getItem(key))

        const handleChange = (event: Event) => {
            if (event instanceof StorageEvent) {
                if (event.key === key) setValue(localStorage.getItem(key))
            } else if (event instanceof CustomEvent) {
                if (event.detail.key !== key) return

                if (event.detail.action === 'remove') setValue(null)
                if (event.detail.action === 'set') setValue(event.detail.value)
            }
        }
  
        window.addEventListener('storage', handleChange)
        window.addEventListener('localstorage-changed', handleChange)

        return () => {
            window.removeEventListener('storage', handleChange)
            window.removeEventListener('localstorage-changed', handleChange)
        }
    }, [key])
  
    return [value, (v: string) => setLocalStorageItem(key, v)] as const
}

export default useLocalStorageWatcher