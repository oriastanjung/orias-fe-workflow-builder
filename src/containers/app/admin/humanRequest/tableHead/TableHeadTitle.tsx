import React from "react"

import { Filter } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const TableHeadTitle = ({ setTitle }: { setTitle: React.Dispatch<React.SetStateAction<string>> }) => {
    const [open, setOpen] = React.useState<boolean>(false)
    const [value, setValue] = React.useState<string>('')

    const submit = React.useCallback(() => {
        setTitle(value)
        setOpen(false)
    }, [value])

    return (
        <div className="flex items-center gap-4 p-4 justify-between">
            <p>Title</p>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Filter fill="gray" stroke="none" size={10} className="cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="flex">
                    <Input placeholder="Title..." value={value} onChange={(e) => setValue(e.target.value)} className="rounded-l-lg rounded-r-none" />
                    <Button className="rounded-r-lg rounded-l-none" onClick={submit}>Yeah</Button>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default TableHeadTitle