import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axiosInstance from '@/lib/axios'
import { useBrandGuideline } from '@/pages/app/BrandGuideline'

const contactSchema = z.object({
    type: z.string().min(1, { error: 'Type is required' }),
    value: z.string().min(1, { error: 'Value is required' })
})

const formSchema = z.object({
    contacts: z.array(contactSchema)
})

const Contacts = () => {
    // Get data from parent context
    const { brandGuideline } = useBrandGuideline()

    const [search] = useSearchParams()
    const id = search.get('id')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contacts: []
        }
    })

    const { fields, append, remove, insert } = useFieldArray({
        control: form.control,
        name: 'contacts',
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
            form.setValue('contacts', brandGuideline.contacts)
        }
    }, [brandGuideline])

    return (
        <>
            <div className='flex flex-col gap-2 md:col-span-2'>
                <h2 className='text-2xl font-bold luckiest-guy-regular'>Contact</h2>
                <p className='text-neutral-500'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem voluptatibus vero blanditiis praesentium modi sunt quam commodi doloribus laboriosam repellat, in voluptates ipsa dignissimos error.</p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                        {fields.map((field, index) => (
                            <fieldset key={field.id} className='flex gap-2'>
                                <FormField
                                    control={form.control}
                                    name={`contacts.${index}.type`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} className='bg-white' placeholder='website, instagram, etc.' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`contacts.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem className='flex-1'>
                                            <FormControl>
                                                <Input {...field} className='bg-white' placeholder='Value'/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button size='icon' onClick={() => insert(index + 1, { type: '', value: '' })}><Plus /></Button>
                                <Button size='icon' variant='destructive' onClick={() => remove(index)}><Trash /></Button>
                            </fieldset>
                        ))}
                        <Button onClick={() => append({ type: '', value: '' })}>Add Contact</Button>
                        <Button type='submit'>Update</Button>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default Contacts