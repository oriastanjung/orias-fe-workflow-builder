import React from 'react'

import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Command, CommandEmpty, CommandInput, CommandItem, CommandGroup, CommandList, CommandSeparator } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAuth } from '@/contexts/AuthContext'
import axiosInstance from '@/lib/axios'

const ProfileContext = ({ isOpen, setIsOpen, children }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void, children: React.ReactNode }) => {
    // Use app context
    const { user, setUser, selectedRole, setSelectedRole } = useAuth()

    const navigate = useNavigate()

    // Logout
    const logout = async () => {
        await axiosInstance.post('/api/v1/auth/sign-out')
        setIsOpen(false)
        setUser(null)
        navigate('/auth/sign-in')
    }

    React.useEffect(() => localStorage.setItem('selectedRole', selectedRole), [selectedRole])

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent>
                <Command>
                    <CommandInput placeholder='Search...' />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup key='general'>
                            <CommandItem
                                key='settings'
                                value='settings'
                                onSelect={() => navigate('/app/settings/profile')}
                            >
                                Settings
                            </CommandItem>
                            <CommandItem
                                key='logout'
                                value='logout'
                                onSelect={logout}
                            >
                                Logout
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup key='roles' heading='Roles'>
                            {user?.roles.map(role => (
                                <CommandItem key={role.id} id={role.id} value={role.name} onSelect={setSelectedRole}>
                                    {role.name}
                                    {selectedRole === role.name && (
                                        <Check />
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default ProfileContext