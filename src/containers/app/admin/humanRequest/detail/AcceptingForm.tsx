import React from "react"

import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import axiosInstance from '@/lib/axios'
import { useAuth } from "@/contexts/AuthContext"

const AcceptingForm = ({ data }: { data: any }) => {
    // Hold internal states
    const [assignee, setAssignee] = React.useState<string>(data.assignee?.id)
    const [description, setDescription] = React.useState<string>('')

    const navigate = useNavigate()

    // Get data from parent context
    const { user } = useAuth()

    const submit = React.useCallback(() => {
        toast.promise(async () => {
            await axiosInstance.put(`/api/v1/admin-tools/human-request/${data.id}`, { status: 'In Progress', description })
        }, {
            loading: 'Submitting',
            success: () => {
                navigate('/app/admin/human-request')
                return 'Submitted'
            },
            error: 'An error occured'
        })
    }, [assignee, description, user])
    
    return (
        <>
            <div className="flex items-center gap-2">
                <p>Assignee</p>
                <Select disabled value={data.assignee.id} onValueChange={setAssignee}>
                    <SelectTrigger>
                        <SelectValue placeholder='Select Assignee' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={data.assignee.id}>{data.assignee.name}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div>
                <Button onClick={submit}>Accept Task</Button>
            </div>
        </>
    )
}

export default AcceptingForm