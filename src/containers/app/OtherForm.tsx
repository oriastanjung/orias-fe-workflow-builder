import React from "react"

import type { UseFormReturn } from "react-hook-form"

import { Textarea } from "@/components/ui/textarea"
import type { FormType } from "./NewRequestDialog"

const OtherForm = ({ form }: { form: UseFormReturn<FormType, any, FormType> }) => {
    // Hold internal states
    const [request, setRequest] = React.useState<string>("")

    React.useEffect(() => {
        form.setValue('initialMessage.content', request)
    }, [request])

    return (
        <div className="flex flex-col gap-4">
            <h1 className="font-bold">Logo Spesification</h1>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Detail Request</p>
                <Textarea value={request} onChange={(e) => setRequest(e.target.value)} className="bg-white" placeholder="Type your request detail here" />
            </div>
        </div>
    )
}

export default OtherForm