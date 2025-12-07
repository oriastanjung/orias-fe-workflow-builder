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
    name: z.string({ message: 'Name is required' }).min(1, { message: 'Name is required' }),
    email: z.email({ message: 'Email is not valid' }),
    password: z.string({ message: 'Password is required' }).min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string({ message: 'Confirm password is required' }).min(8, { message: 'Password must be at least 8 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password does not match'
})

const SignUpForm = () => {
    const { setCode } = useAuthPageContext()
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        toast.promise(async () => {
            const response = await axiosInstance.post('/api/v1/auth/sign-up', data)
            if (response.status === 201) {
                const { code } = response.data.data
                setCode(code)
                navigate(`/auth/verify-email`)
            }
        }, {
            loading: 'Signing up...',
            success: 'Signed up successfully',
            error: 'An error occurred'
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-white text-xs'>Name</FormLabel>
                            <FormControl>
                                <Input {...field} className='bg-white' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />  
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
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-white text-xs'>Password</FormLabel>
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
                <Button type='submit' className='bg-brand-green hover:bg-brand-green/90 text-black rounded-full border border-black self-end'>Sign Up</Button>
            </form>
        </Form>
    )
}

export default SignUpForm