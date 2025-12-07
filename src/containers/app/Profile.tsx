import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { ChevronsUpDown } from 'lucide-react'

import ProfileContext from '@/containers/app/ProfileContext'
import type { User } from '@/types/user'

const Profile = ({ user }: { user: User }) => {
    // Hold internal states
    const [isOpen, setIsOpen] = React.useState(false)
    return (
        <ProfileContext isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className='flex flex-row items-center gap-2 cursor-pointer' onClick={() => setIsOpen(true)}>
                <Avatar className='flex justify-center items-center bg-neutral-500 w-10 h-10 rounded-full overflow-hidden'>
                    <AvatarImage src={user.avatar || `https://ui-avatars.com/api?name=${user.name}`} />
                    <AvatarFallback className='bg-neutral-500'>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='flex-1 flex flex-col'>
                    <h1 className='text-sm font-medium'>{user.name}</h1>
                    <p className='text-xs text-neutral-500'>{user.subscriptions[0]?.package?.name || 'Free Plan'}</p>
                </div>
                <div>
                    <ChevronsUpDown size={14} />
                </div>
            </div>
        </ProfileContext>
    )
}

export default Profile