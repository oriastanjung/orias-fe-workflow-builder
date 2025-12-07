import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import LogoForm from '@/containers/app/LogoForm'
import PosterForm from '@/containers/app/PosterForm'
import OtherForm from '@/containers/app/OtherForm'
import { useAuth } from '@/contexts/AuthContext'
import axiosInstance from '@/lib/axios'
import { CHAT_AI, CHAT_HUMAN, CHAT_LOGO, CHAT_POSTER } from '@/types/chat'
import type { Item } from '@/types/package'

const TYPE_OPTIONS = [CHAT_AI, CHAT_HUMAN]

const NewRequestDialogContext = React.createContext<{
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    defaultValues: FormType,
    setDefaultValues: (val: Partial<FormType>) => void
}>({
    isOpen: false,
    setIsOpen: () => {},
    defaultValues: {
        type: CHAT_AI,
        itemId: CHAT_POSTER,
        title: '',
        initialMessage: {
            content: ''
        }
    },
    setDefaultValues: () => {}
})

export const useNewRequestDialog = () => {
    return React.useContext(NewRequestDialogContext)
}

const formSchema = z.object({
    type: z.enum([CHAT_AI, CHAT_HUMAN], { error: `Type must be ${CHAT_AI} or ${CHAT_HUMAN}` }),
    itemId: z.string().min(1, { error: 'Category is required' }),
    title: z.string().min(1, { error: 'Title is required' }),
    initialMessage: z.object({
        content: z.string().min(1, { error: 'Initial message is required' })
    }),
})

export type FormType = z.infer<typeof formSchema>

const NewRequestDialog = ({ children }: { children: React.ReactNode }) => {
    // Hold internal states
    const [isOpen, setIsOpen] = React.useState(false)
    const [defaultValues, _setDefaultValues] = React.useState<FormType>({
        type: CHAT_AI,
        itemId: CHAT_POSTER,
        title: '',
        initialMessage: {
            content: ''
        }
    })
    const setDefaultValues = (val: Partial<FormType>) => {
        _setDefaultValues(prev => ({ ...prev, ...val }))
    }
    const [humanRequestOptions, setHumanRequestOptions] = React.useState<Item[]>([])

    const navigate = useNavigate()
    const form = useForm<FormType>({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    // Get available items from user data
    const { user } = useAuth()
    const availableHumanRequestOptions = React.useMemo(() => {
        if (user && user.subscriptions.length > 0) {
            return user.subscriptions[0].package?.packageItems.map(item => item.item) || []
        }

        return []
    }, [user])

    const type = form.watch('type')
    const category = form.watch('itemId')

    // Whenever default values change, Change corresponding form value
    React.useEffect(() => {
        (Object.keys(defaultValues) as Array<keyof typeof defaultValues>).map((key) => {
            form.setValue(key, defaultValues[key])
        })
    }, [defaultValues])

    React.useEffect(() => {
        form.setValue('itemId', '')
    }, [type, form])

    // Loading all items
    React.useEffect(() => {
        toast.promise(async () => {
            const response = await axiosInstance.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subscription-tools/item`)
            return response.data.data
        }, {
            loading: 'Loading categories',
            success: data => {
                setHumanRequestOptions(data)
                return 'Categories loaded'
            },
            error: 'An error occured'
        })
    }, [])

    // Create new request
    const onSubmit = async (data: FormType) => {
        toast.promise(async () => {
            const response = await axiosInstance.post('/api/v1/chat-tools/chat', data)
            return response.data.data
        }, {
            loading: 'Creating new request',
            success: (data) => {
                // On success, redirect to chat detail
                const { id, type } = data.chat
                setIsOpen(false)
                if (type === CHAT_AI) {
                    localStorage.setItem(`chat-process-${id}`, JSON.stringify({
                        process: 'Initiating Process',
                    }))
                }
                navigate(`/app/chat/${id}`)
                return 'New request created'
            },
            error: 'An error occured'
        })
    }

    return (
        <NewRequestDialogContext.Provider value={{ isOpen, setIsOpen, defaultValues, setDefaultValues }}>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className='max-h-[90vh] overflow-y-auto'>
                    <DialogHeader>
                        <DialogTitle>New Request</DialogTitle>
                    </DialogHeader>
                    <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                            <div className='flex gap-2'>
                                <FormField
                                    control={form.control}
                                    name='type'
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormLabel>Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl className='w-full bg-white'>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Type' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {TYPE_OPTIONS.map(type => (
                                                        <SelectItem disabled={type === CHAT_HUMAN && (!user || user.subscriptions.length === 0)} value={type}>
                                                            <div className='flex flex-col items-start'>
                                                                {type}
                                                                {type === CHAT_HUMAN && (!user || user.subscriptions.length === 0) && <p className='text-xs text-neutral-500'>Only available for subscribed user</p>}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='itemId'
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} value={category} defaultValue={field.value}>
                                                <FormControl className='w-full bg-white'>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Category' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {type === CHAT_AI && humanRequestOptions.filter(category => category.isAi).map(category => (
                                                        <SelectItem value={category.id}>{category.name}</SelectItem>
                                                    ))}
                                                    {type === CHAT_HUMAN && humanRequestOptions.map(category => {
                                                        const isAvailable = availableHumanRequestOptions.some(cat => cat.id === category.id)
                                                        const maxQuota = user?.subscriptions[0]?.package?.packageItems.find(it => it.item.id === category.id)?.max || 0
                                                        const used = user?.quotaUsed.find(quota => quota.itemId === category.id)?._count._all || 0
                                                        const remaining = maxQuota - used
                                                        return (
                                                        <SelectItem value={category.id} disabled={!isAvailable || remaining <= 0}>
                                                            <div className='flex flex-col items-start'>
                                                                <p>{category.name}</p>
                                                                <p className='text-[10px] text-neutral-500'>
                                                                    {isAvailable
                                                                        ? `${remaining} remaining quota`
                                                                        : 'Not available in your current package'}
                                                                </p>
                                                            </div>
                                                        </SelectItem>
                                                    )})}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} className='bg-white' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='initialMessage.content'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input {...field} className='hidden' />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            {category === CHAT_LOGO ? <LogoForm form={form} /> :
                            category === CHAT_POSTER ? <PosterForm form={form} /> :
                            <OtherForm form={form} />}
                            <Button type='submit'>Create</Button>
                        </form>
                    </Form>
                    </div>
                </DialogContent>
            </Dialog>
            {children}
        </NewRequestDialogContext.Provider>
    )
}

export default NewRequestDialog