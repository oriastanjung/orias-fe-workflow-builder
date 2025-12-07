import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import axiosInstance from '@/lib/axios'
import { useAuthPageContext } from '@/pages/auth/AuthLayout'

const formSchema = z.object({
    email: z.email({ message: 'Email is not valid' }),
    password: z.string({ message: 'Password is required' }).min(1, { message: 'Password is required' }),
})

const SignInForm = () => {
    const { setUser } = useAuth()
    const { setCode } = useAuthPageContext()

    const navigate = useNavigate()
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        toast.promise(async () => {
            const response = await axiosInstance.post('/api/v1/auth/sign-in', data)
            if (response.status === 200) {
                const { code } = response.data.data
                if (code) {
                    setCode(code)
                    navigate(`/auth/verify-email`)
                } else {
                    setUser(response.data.data.user)
                    navigate('/app/chat')
                }
            }
        }, {
            loading: 'Signing in...',
            success: 'Signed in successfully',
            error: (error) => {
                if (error.response.status === 401) {
                    return 'Invalid email or password'
                }
                return 'An error occurred'
            }
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
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='flex justify-between'>
                                <p className='text-white text-xs'>Password</p>
                                <Link to='/auth/forgot-password' className='text-white text-xs'>Forgot password?</Link>
                            </FormLabel>
                            <FormControl>
                                <Input {...field} type='password' className='bg-white' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className='bg-brand-green hover:bg-brand-green/90 text-black rounded-full border border-black self-end'>Sign In</Button>
            </form>
        </Form>
    )
}

export default SignInForm