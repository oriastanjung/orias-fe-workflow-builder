import React from 'react'

import { Upload } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import axiosInstance from '@/lib/axios'
import { useBrandGuideline } from '@/pages/app/BrandGuideline'

const Logo = () => {
    // Hold internal states
    const [logo, setLogo] = React.useState<string>('')
    
    // Get data from parent context
    const { brandGuideline } = useBrandGuideline()
    const logos = brandGuideline?.logos

    const [search] = useSearchParams()
    const id = search.get('id')

    const inputRef = React.useRef<HTMLInputElement>(null)

    // Upload logo
    const onLogoChange = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            toast.promise(async () => {
                const file = Array.from(e.target.files!)[0]
                const formData = new FormData()

                formData.append('files', file)
                formData.append('parentFolder', `brand-guideline/${id}/logos`)

                // Upload to bucket
                const response = await axiosInstance.post(`api/v1/app-tools/file`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                const url = response.data.data.urls[0]

                // then update the brand guideline on upload success
                await axiosInstance.put(`/api/v1/profile-tools/brand-guideline/${id}`, { logos: [{ type: 'default', color: 'default', url }] })

                // then update the logo in view
                setLogo(url)
            }, {
                loading: 'Updating logo',
                success: 'Logo updated',
                error: 'An error occured'
            })
        }
    }, [id])

    React.useEffect(() => {
        if (logos && logos.length > 0) {
            setLogo(logos[0].url)
        }
    }, [logos])

    return (
        <>
            <div className='flex flex-col gap-2'>
                <h2 className='text-2xl font-bold luckiest-guy-regular'>Logo</h2>
                <p className='text-neutral-500'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem voluptatibus vero blanditiis praesentium modi sunt quam commodi doloribus laboriosam repellat, in voluptates ipsa dignissimos error.</p>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='cursor-pointer bg-white p-4 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex flex-col items-center justify-center' onClick={() => { inputRef.current?.click() }}>
                    {logo ? <img src={logo} alt='logo' className='w-full' /> : (
                    <>
                        <Upload />
                        Upload logo here
                    </>)}
                </div>
                <Input type='file' placeholder='Upload Logo' onChange={onLogoChange} ref={inputRef} />
            </div>
        </>
    )
}

export default Logo