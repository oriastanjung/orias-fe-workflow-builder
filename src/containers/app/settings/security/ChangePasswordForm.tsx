import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import axiosInstance from '@/lib/axios'

const formSchema = z.object({
    currentPassword: z.string({ message: 'Current password is required' }),
    newPassword: z.string({ message: 'New password is required' }),
    confirmNewPassword: z.string({ message: 'Confirm new password is required' }),
})

const ChangePasswordForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        toast.promise(async () => {
            await axiosInstance.post('/api/v1/auth/change-password', data)
        }, {
            loading: 'Updating password',
            success: 'Password updated',
            error: 'An error occured'
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <FormField
                    control={form.control}
                    name='currentPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-xs'>Current Password</FormLabel>
                            <FormControl>
                                <Input {...field} className='bg-white' type='password' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='newPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-xs'>New Password</FormLabel>
                            <FormControl>
                                <Input {...field} className='bg-white' type='password' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='confirmNewPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-xs'>Confirm New Password</FormLabel>
                            <FormControl>
                                <Input {...field} className='bg-white' type='password' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className='bg-brand-green hover:bg-brand-green/90 text-black rounded-full border border-black self-end'>Change Password</Button>
            </form>
        </Form>
    )
}

export default ChangePasswordForm