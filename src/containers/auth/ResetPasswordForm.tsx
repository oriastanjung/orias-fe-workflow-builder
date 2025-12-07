import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import axiosInstance from '@/lib/axios'

const formSchema = z.object({
    password: z.string({ message: 'Password is required' }).min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string({ message: 'Confirm password is required' }).min(8, { message: 'Password must be at least 8 characters' }),
})

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        toast.promise(async () => {
            const response = await axiosInstance.post('/api/v1/auth/reset-password', { ...data, code: searchParams.get('code') })
            return response
        }, {
            loading: 'Resetting password...',
            success: () => {
                navigate('/auth/sign-in')
                return 'Password reset successfully'
            },
            error: 'An error occurred',
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-white text-xs'>New Password</FormLabel>
                            <FormControl>
                                <Input {...field} type='password' className='bg-white' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-white text-xs'>Confirm Password</FormLabel>
                            <FormControl>
                                <Input {...field} type='password' className='bg-white' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className='bg-brand-green hover:bg-brand-green/90 text-black rounded-full border border-black self-end'>Reset Password</Button>
            </form>
        </Form>
    )
}

export default ResetPasswordForm