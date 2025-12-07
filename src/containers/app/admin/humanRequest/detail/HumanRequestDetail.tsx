import React from "react"

import { useParams } from "react-router-dom"
import { toast } from "sonner"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import BriefEditor from "@/containers/app/admin/humanRequest/detail/BriefEditor"
import AssignForm from "@/containers/app/admin/humanRequest/detail/AssignForm"
import AcceptingForm from "@/containers/app/admin/humanRequest/detail/AcceptingForm"
import { useAuth } from "@/contexts/AuthContext"
import axiosInstance from '@/lib/axios'
import { dateToWhatsappKindaFormat } from "@/lib/date"

const HumanRequestDetail = () => {
    // Hold internal states
    const [data, setData] = React.useState<any>(null)
    const [isLoading, setIsloading] = React.useState<boolean>(true)
    
    const { id } = useParams()
    const { user } = useAuth()
    const isManager = React.useMemo(() => user?.roles.some(role => ['Superadmin', 'Designer Manager'].includes(role.name)), [user])

    React.useEffect(() => {
        toast.promise(async () => {
            const projections = [
                'assignee.id',
                'assignee.name',
                'chat.user.id',
                'chat.user.name',
                'chat.user.email',
                'chat.title',
                'chat.item.name',
                'histories.status',
                'histories.date',
                'histories.description',
                'histories.media',
                'histories.updatedBy.name',
                'brief',
                'createdAt',
                'updatedAt'
            ]
            const response = await axiosInstance.get(`api/v1/admin-tools/human-request/${id}?projection=${projections.join(',')}`)
            return response.data.data
        }, {
            loading: 'Loading human request',
            success: data => {
                setData(data)
                setIsloading(false)
                return 'Human request loaded'
            },
            error: 'An error occured'
        })
    }, [])
    
    return isLoading ? <p>Loading</p> : (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold">{data.chat.title}</h1>
                <p className="text-sm text-neutral-700">{data.chat.item.name} requested by {data.chat.user.name}</p>
            </div>
            <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-bold">Detail</h2>
                        {data.histories.slice(-1)[0].status === 'Pending' && <AssignForm data={data} />}
                        {data.histories.slice(-1)[0].status === 'Assigned' && (isManager ? <AssignForm data={data} /> : <AcceptingForm data={data} />)}
                    </div>
                    <div className="w-full overflow-x-auto">
                        <h2 className="text-lg font-bold">History</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    {/* <TableHead>Media</TableHead> */}
                                    <TableHead>Updated by</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.histories.map((history: any) => {
                                    const badgeColor = 
                                        history.status === 'Pending' ? 'bg-red-500' :
                                        history.status === 'Assigned' ? 'bg-orange-500' :
                                        history.status === 'In Progress' ? 'bg-blue-500' :
                                        history.status === 'In Review' ? 'bg-yellow-500' :
                                        history.status === 'QC Revision' ? 'bg-red-500' :
                                        history.status === 'QC Accepted' ? 'bg-green-500' :
                                        history.status === 'User Revision' ? 'bg-red-500' :
                                        history.status === 'Completed' ? 'bg-green-500' : 'bg-black'
                                    return (
                                        <TableRow key={history.id}>
                                            <TableCell><Badge className={badgeColor}>{history.status}</Badge></TableCell>
                                            <TableCell>{dateToWhatsappKindaFormat(new Date(history.date))}</TableCell>
                                            <TableCell>{history.description}</TableCell>
                                            {/* <TableCell>{history.media}</TableCell> */}
                                            <TableCell>{history.updatedBy.name}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="flex-1 shrink-0">
                    <h2 className="text-lg font-bold">Brief</h2>
                    <BriefEditor data={data} />
                </div>
            </div>
        </div> 
    )
}

export default HumanRequestDetail