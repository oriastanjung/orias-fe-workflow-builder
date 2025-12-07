import dayjs from 'dayjs'

/**
 * This function is used to convert js date object to natural language date,
 * like 3 seconds ago, 7 hours ago, etc.
 * 
 * @param date date to be converted
 * @returns converted date
 */
export const dateToNaturalLanguage = (date: Date) => {
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds} seconds ago`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minutes ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`

    const days = Math.floor(hours / 24)
    if (days === 1) return `yesterday`
    if (days < 30) return `${days} days ago`

    const months = Math.floor(days / 30)
    if (months < 12) return `${months} months ago`

    const years = Math.floor(months / 12)
    return `${years} years ago`
}

/**
 * This function is used to convert js date object into whatsapp like format
 * like Today 08.01, Yesterday 17.01, etc.
 * 
 * @param date date to be converted
 * @param config time configuration
 * @returns converted date
 */
export const dateToWhatsappKindaFormat = (date: Date, config?: Record<string, unknown>) => {
    const now = dayjs()
    
    const isToday = dayjs(date).isSame(now, 'day')
    const isYesterday = dayjs(date).add(1, 'day').isSame(now, 'day')
    const isTomorrow = dayjs(date).subtract(1, 'day').isSame(now, 'day')
    return `${isToday ? 'Today' : isYesterday ? 'Yesterday' : isTomorrow ? 'Tomorrow' : date.toLocaleDateString('id', { dateStyle: 'long' })}, ${date.toLocaleTimeString('id', { hour: (config?.hour as any) || 'numeric', minute: (config?.minute as any) || 'numeric', second: (config?.second as any)})}`
}