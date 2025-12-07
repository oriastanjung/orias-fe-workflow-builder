import React from 'react'

import { Button } from '@/components/ui/button'
import AIChatList from '@/containers/app/chat/AIChatList'
import HumanChatList from '@/containers/app/chat/HumanChatList'
import { useAuth } from '@/contexts/AuthContext'

const ChatList = () => {
    // Hold internal states
    const [tab, _setTab] = React.useState<string>('AI')

    // Get data from parent context
    const { user } = useAuth()

    const setTab = (tabname: string) => () => {
        _setTab(tabname)
    }
    return  (
        <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
                <Button onClick={setTab('AI')} size='sm' variant={tab === 'AI' ? 'default' : 'ghost'}>AI</Button>
                <Button disabled={!user || user.subscriptions.length === 0} onClick={setTab('Human')} size='sm' variant={tab === 'Human' ? 'default' : 'ghost'}>Human</Button>
            </div>
            <div className={`${tab !== 'AI' && 'hidden'}`}><AIChatList /></div>
            <div className={`${tab !== 'Human' && 'hidden'}`}><HumanChatList /></div>
        </div>
    )
}

export default ChatList