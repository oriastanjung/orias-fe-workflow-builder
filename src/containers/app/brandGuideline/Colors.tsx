import React from 'react'

import { Plus, Trash } from 'lucide-react'
import { SketchPicker } from 'react-color'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import axiosInstance from '@/lib/axios'
import { useBrandGuideline } from '@/pages/app/BrandGuideline'

const ColorPicker = ({ defaultColor, isLoading, commitFunction }: { defaultColor?: string, isLoading: boolean, commitFunction: (color: string) => void }) => {
    const [color, setColor] = React.useState<string>(defaultColor || '#ffffff')

    const commit = React.useCallback(() => {
        commitFunction(color)
    }, [color])
    
    return (
        <>
            <SketchPicker presetColors={[]} className='bg-white! border-none! rounded-none! shadow-none! p-0!' color={color} onChange={e => setColor(e.hex)} />
            <Button size='sm' disabled={isLoading} onClick={commit}>Update</Button>
        </>
    )
}

const Colors = () => {
    // Hold internal states
    const [colors, setColors] = React.useState<string[]>([])
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const [search] = useSearchParams()
    const id = search.get('id')

    // Get data from parent context
    const { brandGuideline } = useBrandGuideline()
    const colorPalette = brandGuideline?.colorPalette

    // Add new color
    const addNewColor = React.useCallback((newColor: string) => {
        toast.promise(async () => {
            setIsLoading(true)
            await axiosInstance.put(`api/v1/profile-tools/brand-guideline/${id}`, {
                colorPalette: [...colors, newColor]
            })

            setIsLoading(false)
            setColors(prev => [...prev, newColor])
        }, {
            loading: 'Adding color',
            success: 'Color added',
            error: 'An error occured'
        })
    }, [colors, id])

    // Edit existing color
    const editColor = React.useCallback((index: number) => (newColor: string) => {
        toast.promise(async () => {
            setIsLoading(true)
            await axiosInstance.put(`api/v1/profile-tools/brand-guideline/${id}`, {
                colorPalette: colors.map((color, idx) => index === idx ? newColor : color)
            })

            setIsLoading(false)
            setColors(prev => prev.map((color, idx) => index === idx ? newColor : color))
        }, {
            loading: 'Updating color',
            success: 'Color updated',
            error: 'An error occured'
        })
    }, [colors, id])

    // Delete existing color
    const deleteColor = React.useCallback((index: number) => {
        toast.promise(async () => {
            setIsLoading(true)
            await axiosInstance.put(`api/v1/profile-tools/brand-guideline/${id}`, {
                colorPalette: colors.filter((_, idx) => idx !== index)
            })

            setIsLoading(false)
            setColors(prev => prev.filter((_, idx) => idx !== index))
        }, {
            loading: 'Deleting color',
            success: 'Color deleted',
            error: 'An error occured'
        })
    }, [colors, id])

    // Load color palette from parent context
    React.useEffect(() => {
        if (colorPalette) {
            setColors(colorPalette)
        }
    }, [colorPalette])

    return (
        <>
            <div className='flex flex-col gap-2'>
                <h2 className='text-2xl font-bold luckiest-guy-regular'>Colors</h2>
                <p className='text-neutral-500'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem voluptatibus vero blanditiis praesentium modi sunt quam commodi doloribus laboriosam repellat, in voluptates ipsa dignissimos error.</p>
            </div>
            <div className='grid grid-cols-2 gap-4 shrink-0'>
                {colors.map((color, index) => (
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className='flex flex-col gap-2 rounded-lg p-1 border-2 border-black shadow-[2px_2px_0px_0px_#000000]'>
                                <div className='rounded-md aspect-[4/3] h-[100px]' style={{ backgroundColor: color }} />
                                <div className='flex justify-between items-center'>
                                    <p className='text-neutral-500'>{color}</p>
                                    <Trash size={16} className='cursor-pointer' onClick={(e) => {e.stopPropagation();deleteColor(index)}} />
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-4 bg-white shadow-md flex flex-col gap-2 rounded-lg'>
                            <ColorPicker defaultColor={color} isLoading={isLoading} commitFunction={editColor(index)} />
                        </PopoverContent>
                    </Popover>
                ))}
                <Popover>
                    <PopoverTrigger asChild>
                        <div className='bg-neutral-200 cursor-pointer rounded-lg flex items-center justify-center p-4'>
                            <div className='flex flex-col gap-2 items-center'>
                                <Plus color='var(--color-neutral-500)' />
                                <p className='text-neutral-500'>Add Color</p>
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-4 bg-white shadow-md flex flex-col gap-2 rounded-lg'>
                        <ColorPicker isLoading={isLoading} commitFunction={addNewColor} />
                    </PopoverContent>
                </Popover>
            </div>
        </>
    )
}

export default Colors