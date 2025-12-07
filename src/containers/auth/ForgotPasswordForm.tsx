import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axiosInstance from '@/lib/axios'
import { useAuthPageContext } from '@/pages/auth/AuthLayout'

const formSchema = z.object({
    email: z.email({ message: 'Email is not valid' }),
})

const ForgotPasswordForm = () => {
    const { setCode } = useAuthPageContext()

    const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        toast.promise(async () => {
            const response = await axiosInstance.post('/api/v1/auth/forgot-password', data)
            if (response.status === 200) {
                const { code } = response.data.data
                setCode(code)
                navigate(`/auth/forgot-password-done`)
            }
        }, {
            loading: 'Sending reset password link...',
            success: 'Reset password link sent successfully',
            error: 'An error occurred',
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-white text-xs'>Email</FormLabel>
                            <FormControl>
                                <Input {...field} className='bg-white' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className='self-end bg-brand-green hover:bg-brand-green/90 text-black rounded-full border border-black'>Reset Password</Button>
            </form>
        </Form>
    )
}

export default ForgotPasswordForm