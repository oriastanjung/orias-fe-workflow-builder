import React from 'react'

import { Diamond, Images, Sparkles, User } from 'lucide-react'
import { Outlet, useNavigate } from 'react-router-dom'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import ChatList from '@/containers/app/chat/ChatList'
import Profile from '@/containers/app/Profile'
import { useNewRequestDialog, type FormType } from '@/containers/app/NewRequestDialog'
import { useAuth } from '@/contexts/AuthContext'

const SidebarContext = React.createContext<{ search: string }>({ search: '' })

export const useSidebarContext = () => React.useContext(SidebarContext)
  
const SidebarLayout = () => {
    // Hold internal states
    const [search, setSearch] = React.useState<string>('')

    // Use app context
    const { user, selectedRole } = useAuth()
    const { setIsOpen, setDefaultValues } = useNewRequestDialog()

    const isUser = React.useMemo(() => ['User'].includes(selectedRole), [selectedRole])

    const navigate = useNavigate()

    // Custom choose button click handler
    const choose = React.useCallback((defaultValues: Partial<FormType>) => () => {
        setIsOpen(true)
        setDefaultValues(defaultValues)
    }, [])

    return (
        <SidebarProvider>
            <SidebarContext.Provider value={{ search }}>
                <Sidebar className='bg-neutral-50'>
                    <SidebarHeader className='p-4 space-y-2'>
                        <img src='/logo-black.svg' alt='logo' className='w-[100px] h-[24px] cursor-pointer' onClick={() => navigate('/app/chat')}/>
                        <Input placeholder='Search' className='bg-white' value={search} onChange={e => setSearch(e.target.value)}/>
                    </SidebarHeader>
                    <SidebarContent className='overflow-x-hidden p-4'>
                        {!isUser ? (
                            <SidebarGroup>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton disabled className='cursor-pointer bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
                                            Statistics
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton onClick={() => navigate('/app/admin/human-request')} className='cursor-pointer bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
                                            Human Request
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton disabled className='cursor-pointer bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
                                            User Management
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton disabled className='cursor-pointer bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
                                            Error
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroup>
                        ) : (
                            <>
                                <SidebarGroup>
                                    <SidebarGroupLabel className='p-0'>NEW REQUEST</SidebarGroupLabel>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton onClick={choose({ type: 'AI', itemId: '' })} className='cursor-pointer bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
                                                <Sparkles /> AI Request
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton disabled={!user || user.subscriptions.length === 0} onClick={choose({ type: 'Human', itemId: '' })} className='cursor-pointer bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
                                                <User /> Human Request
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroup>
                                <SidebarGroup>
                                    <SidebarGroupLabel className='p-0'>YOUR RESOURCES</SidebarGroupLabel>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton disabled={!user} onClick={() => navigate('/app/brand-guideline')} className='cursor-pointer bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
                                                <Diamond /> Brand Guideline
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton disabled={true} className='cursor-pointer bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'>
                                                <Images /> Library
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroup>
                                <SidebarGroup className='flex flex-col gap-2'>
                                    <SidebarGroupLabel className='p-0'>CHATS</SidebarGroupLabel>
                                    {user && <ChatList />}
                                </SidebarGroup>
                            </>
                        )}
                    </SidebarContent>
                    <SidebarFooter>
                        {user && <Profile user={user} />}
                    </SidebarFooter>
                </Sidebar>
                <SidebarInset className='relative'>
                    <SidebarTrigger />
                    <div className='flex flex-col h-[calc(100vh-28px)] p-4 overflow-y-auto'>
                        <Outlet />
                    </div>
                </SidebarInset>
            </SidebarContext.Provider>
        </SidebarProvider>
    )
  }

export default SidebarLayout