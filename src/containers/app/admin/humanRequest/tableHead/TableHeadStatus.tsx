import React from "react"

import { Check, Filter } from "lucide-react"

import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const DATA = [
    'Pending',
    'Assigned',
    'In Progress',
    'In Review',
    'QC Revision',
    'QC Accepted',
    'User Revision',
    'Completed'
]

const TableHeadStatus = ({ selected, setSelected }: { selected: string, setSelected: React.Dispatch<React.SetStateAction<string>> }) => {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex items-center justify-between">
            <p>Status</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Filter fill="gray" stroke="none" size={10} className="cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent>
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                { DATA.map(status => (
                                    <CommandItem className="flex justify-between" value={status} key={status} onSelect={() => { selected === status ? setSelected('') : setSelected(status) }}>
                                        {status}
                                        {selected === status && (<Check />)}
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

export default TableHeadStatus