import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axiosInstance from '@/lib/axios'
import { useBrandGuideline } from '@/pages/app/BrandGuideline'

const formSchema = z.object({
    name: z.string({ error: 'Name is required' }).min(1, { error: 'Name is required' }),
    type: z.string({ error: 'Type is required' }).min(1, { error: 'Type is required' }),
    description: z.string({ error: 'Description is required' }).min(1, { error: 'Description is required' }),
    advantage: z.string(),
    contactEmail: z.email({ error: 'Contact email is not valid' })
})

const General = () => {
    // Get data from parent context
    const { brandGuideline } = useBrandGuideline()

    const [search] = useSearchParams()
    const id = search.get('id')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: '',
            description: '',
            advantage: '',
            contactEmail: ''
        }
    })

    // Update brand guideline
    const onSubmit = React.useCallback(async (data: z.infer<typeof formSchema>) => {
        toast.promise(async () => {
            await axiosInstance.put(`/api/v1/profile-tools/brand-guideline/${id}`, {
                ...data
            })
        }, {
            loading: 'Updating brand guideline',
            success: 'Brand guideline updated',
            error: 'An error occured'
        })
    }, [id])

    // Initialize form
    React.useEffect(() => {
        if (brandGuideline) {
            form.setValue('name', brandGuideline.name)
            form.setValue('type', brandGuideline.type)
            form.setValue('description', brandGuideline.description)
            form.setValue('advantage', brandGuideline.advantage || '')
            form.setValue('contactEmail', brandGuideline.contactEmail)
        }
    }, [brandGuideline])

    return (
        <div className='md:col-span-2 flex flex-col gap-2'>
            <h2 className='text-2xl font-bold luckiest-guy-regular'>General</h2>
            <p className='text-neutral-500'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem voluptatibus vero blanditiis praesentium modi sunt quam commodi doloribus laboriosam repellat, in voluptates ipsa dignissimos error.</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} className='bg-white' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='type'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <Input {...field} className='bg-white' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} className='bg-white' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='advantage'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Advantage</FormLabel>
                                <FormControl>
                                    <Textarea {...field} className='bg-white' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='contactEmail'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Email</FormLabel>
                                <FormControl>
                                    <Input {...field} className='bg-white' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit'>Update</Button>
                </form>
            </Form>
        </div>
    )
}

export default General