import React from "react"

import { Check, Filter } from "lucide-react"

import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import axiosInstance from '@/lib/axios'

const TableHeadCategory = ({ selected, setSelected }: { selected: string, setSelected: React.Dispatch<React.SetStateAction<string>> }) => {
    const [open, setOpen] = React.useState(false)
    const [data, setData] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    React.useEffect(() => {
        setIsLoading(true)
        axiosInstance.get(`/api/v1/subscription-tools/item?projection=id,name`)
        .then(response => {
            setData(response.data.data)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }, [])

    return (
        <div className="flex items-center justify-between">
            <p>Category</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Filter fill="gray" stroke="none" size={10} className="cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent>
                    <Command>
                        <CommandList>
                            <CommandEmpty>{ isLoading ? 'Loading' : 'No item Found' }</CommandEmpty>
                            <CommandGroup>
                                { data.map(item => (
                                    <CommandItem className="flex justify-between" value={item.name} key={item.id} onSelect={() => { selected === item.id ? setSelected('') : setSelected(item.id) }}>
                                        {item.name}
                                        {selected === item.id && (<Check />)}
                                    </CommandItem>
                                )) }
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            
        </div>
    )
}

export default TableHeadCategory