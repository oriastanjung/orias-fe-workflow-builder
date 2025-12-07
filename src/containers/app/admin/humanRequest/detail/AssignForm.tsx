import React from "react"

import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import axiosInstance from '@/lib/axios'
import { useAuth } from "@/contexts/AuthContext"

const AssignForm = ({ data }: { data: any }) => {
    // Hold internal states
    const [assignees, setAssignees] = React.useState<any[]>([])
    const [assignee, setAssignee] = React.useState<string>(data.assignee?.id)
    const [description, setDescription] = React.useState<string>('')

    const navigate = useNavigate()

    // Get data from parent context
    const { user } = useAuth()

    React.useEffect(() => {
        toast.promise(async () => {
            const response = await axiosInstance.get('/api/v1/admin-tools/user?roles=Designer')
            return response.data.data
        }, {
            loading: 'Loading assignees',
            success: data => {
                setAssignees(data)
                return 'Assignees loaded'
            },
            error: 'An error occured'
        })
    }, [])

    const submit = React.useCallback(() => {
        if (assignee) {
            toast.promise(async () => {
                await axiosInstance.put(`/api/v1/admin-tools/human-request/${data.id}`, { status: 'Assigned', description, assignedById: user?.id, assigneeId: assignee })
            }, {
                loading: 'Submitting',
                success: () => {
                    navigate('/app/admin/human-request')
                    return 'Submitted'
                },
                error: 'An error occured'
            })
        } else {
            toast.error('Choose assignee')
        }
    }, [assignee, description, user])
    
    return (
        <>
            <div className="flex items-center gap-2">
                <p>Assignee</p>
                <Select value={assignee} onValueChange={setAssignee}>
                    <SelectTrigger>
                        <SelectValue placeholder='Select Assignee' />
                    </SelectTrigger>
                    <SelectContent>
                        {assignees.map(assignee => (
                            <SelectItem key={assignee.id} value={assignee.id}>{assignee.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div>
                <Button onClick={submit}>Assign</Button>
            </div>
        </>
    )
}

export default AssignForm