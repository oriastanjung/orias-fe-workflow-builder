import React from "react"

import { Check, Filter } from "lucide-react"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import axiosInstance from '@/lib/axios'
import useDebounceEffect from "@/hooks/useDebounceEffect"

const TableHeadUser = ({ selected, setSelected }: { selected: string, setSelected: React.Dispatch<React.SetStateAction<string>> }) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [data, setData] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    useDebounceEffect(async (signal: any) => {
        setData([])
        if (value.length >= 3) {
            setIsLoading(true)
            const response = await axiosInstance.get(`/api/v1/admin-tools/user?search=${value}`, { signal })
            setData(response.data.data)
            setIsLoading(false)
        }
    }, 1000, [value])

    return (
        <div className="flex items-center justify-between">
            <p>User</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Filter fill="gray" stroke="none" size={10} className="cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent>
                    <Command>
                        <CommandInput value={value} onValueChange={setValue} placeholder="" />
                        <CommandList>
                            <CommandEmpty>{ isLoading ? 'Loading' : value.length >= 3 ? 'No user Found' : 'Type minimum 3 character to see user' }</CommandEmpty>
                            <CommandGroup>
                                { data.map(user => (
                                    <CommandItem className="flex" value={user.name + '-' + user.email} key={user.id} onSelect={() => { selected === user.id ? setSelected('') : setSelected(user.id) }}>
                                        <div className="">
                                            <img src={user.avatar || `https://ui-avatars.com/api?name=${user.name}`} className="w-8 h-8 rounded-full" />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <p>{user.name}</p>
                                            <p className="text-xs text-neutral-500">{user.email}</p>
                                        </div>
                                        {selected === user.id && (
                                            <Check />
                                        )}
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

export default TableHeadUser