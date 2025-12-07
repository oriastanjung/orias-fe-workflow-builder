import React from "react"

export default (callback: Function, delay: number, deps: React.DependencyList) => {
    React.useEffect(() => {
        const controller = new AbortController()
        const handler = setTimeout(() => callback(controller.signal), delay)
        return () => {
            controller.abort()
            clearTimeout(handler)
        }
    }, deps);
}