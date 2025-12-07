import React from "react"

import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import axiosInstance from '@/lib/axios'

const UserReviewForm = ({ data }: { data: any }) => {
    // Hold internal states
    const [assignee, setAssignee] = React.useState<string>(data.assignee?.id)
    const [description, setDescription] = React.useState<string>('')

    const navigate = useNavigate()

    // Get data from parent context
    const { user } = useAuth()

    const submit = React.useCallback((status: string) => {
        toast.promise(async () => {
            await axiosInstance.put(`/api/v1/admin-tools/human-request/${data.id}`, { status, description })
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
            <div className="flex gap-2">
                <Button onClick={() => submit('User Revision')} variant='destructive'>Revise</Button>
                <Button onClick={() => submit('Completed')}>Completed</Button>
            </div>
        </>
    )
}

export default UserReviewForm