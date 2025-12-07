import { Input } from "@/components/ui/input"
import { useBrandGuideline } from "@/pages/app/BrandGuideline"
import { Plus, Trash } from "lucide-react"
import React from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"

import axiosInstance from '@/lib/axios'

const References = () => {
    // Hold internal states
    const [references, setReferences] = React.useState<string[]>([])

    // Get data from parent context
    const { brandGuideline } = useBrandGuideline()

    const [search] = useSearchParams()
    const id = search.get('id')

    const inputRef = React.useRef<HTMLInputElement>(null)

    // Upload file
    const onFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            toast.promise(async () => {
                const formData = new FormData()

                for (const file of Array.from(e.target.files!)) {
                    formData.append('files', file)
                }
                formData.append('parentFolder', `brand-guideline/${id}/references`)

                // Upload to bucket
                const response = await axiosInstance.post(`api/v1/app-tools/file`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                const urls = response.data.data.urls

                // then update the brand guideline on upload success
                await axiosInstance.put(`/api/v1/profile-tools/brand-guideline/${id}`, { references: urls })

                // then update the logo in view
                setReferences(prev => [...prev, ...urls])
            }, {
                loading: 'Updating Reference',
                success: 'Reference updated',
                error: 'An error occured'
            })
        }
    }, [id])

    // Delete file
    const deleteFile = React.useCallback((index: number) => {
        toast.promise(async () => {
            const url = references[index]

            // Delete url from database
            await axiosInstance.put(`/api/v1/profile-tools/brand-guideline/${id}`, {
                references: references.filter((_, idx) => idx !== index)
            })

            // Upon success, update the view
            setReferences(prev => prev.filter((_, idx) => idx !== index))

            // also attempt to delete the file from the bucket, but do not throw error
            axiosInstance.delete(`/api/v1/app-tools/file`, { data: { key: url.split('/').slice(4).join('/') } }).catch(console.log)
        }, {
            loading: 'Deleting file',
            success: 'File deleted',
            error: 'An error occured'
        })
    }, [id, references])

    // Initialize form
    React.useEffect(() => {
        if (brandGuideline) {
            setReferences(brandGuideline.references)
        }
    }, [brandGuideline])

    return (
        <>
            <div className='flex flex-col gap-2'>
                <h2 className='text-2xl font-bold luckiest-guy-regular'>References</h2>
                <p className='text-neutral-500'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem voluptatibus vero blanditiis praesentium modi sunt quam commodi doloribus laboriosam repellat, in voluptates ipsa dignissimos error.</p>
            </div>
            <div className='grid grid-cols-2 gap-4 shrink-0'>
                {references.map((reference, index) => (
                    <div className='relative flex aspect-square flex-col gap-2 rounded-lg p-1 border-2 border-black shadow-[2px_2px_0px_0px_#000000]'>
                        <img src={reference} alt='reference' className="rounded-md"/>
                        <Trash className="cursor-pointer absolute right-2 top-2 p-1 bg-white rounded-sm" size={24} onClick={(e) => {e.stopPropagation(); deleteFile(index)}} />
                    </div>
                ))}
                <div className='bg-neutral-200 cursor-pointer rounded-lg flex items-center justify-center p-4' onClick={() => inputRef.current?.click()}>
                    <div className='flex flex-col gap-2 items-center'>
                        <Plus color='var(--color-neutral-500)' />
                        <p className='text-neutral-500'>Add Reference</p>
                        <Input type="file" className="hidden" ref={inputRef} multiple onChange={onFileChange}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default References