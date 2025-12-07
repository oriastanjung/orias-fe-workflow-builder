import React from "react"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Ellipsis } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ButtonGroup } from "@/components/ui/button-group"
import { Badge } from "@/components/ui/badge"
import TableHeadUser from "@/containers/app/admin/humanRequest/tableHead/TableHeadUser"
import TableHeadCategory from "@/containers/app/admin/humanRequest/tableHead/TableHeadCategory"
import TableHeadStatus from "@/containers/app/admin/humanRequest/tableHead/TableHeadStatus"
import TableHeadlastRequestUpdate from "@/containers/app/admin/humanRequest/tableHead/TableHeadLastRequestUpdate"
import TableHeadTitle from "@/containers/app/admin/humanRequest/tableHead/TableHeadTitle"
import axiosInstance from '@/lib/axios'
import { dateToWhatsappKindaFormat } from "@/lib/date"

const buildPagination = (currentPage: number, totalPages: number, window = 2) => {
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
    currentPage = clamp(currentPage, 1, totalPages);

    const items = [];

    // First & Prev
    items.push({ type: 'first', page: 1, disabled: currentPage === 1 });
    items.push({ type: 'prev',  page: clamp(currentPage - 1, 1, totalPages), disabled: currentPage === 1 });

    // Page window (only 5 pages max when total > 5)
    let start = Math.max(1, currentPage - window);
    let end   = Math.min(totalPages, currentPage + window);

    if (totalPages <= window * 2 + 1) { // if 5 or fewer pages, show all
        start = 1; end = totalPages;
    }
    if (start > 2) {
        items.push({ type: 'ellipsis' })
    }
    for (let p = start; p <= end; p++) {
        items.push({ type: 'page', page: p, active: p === currentPage });
    }
    if (end < totalPages - 1) {
        items.push({ type: 'ellipsis' })
    }

    // Next & Last
    items.push({ type: 'next', page: clamp(currentPage + 1, 1, totalPages), disabled: currentPage === totalPages });
    items.push({ type: 'last', page: totalPages, disabled: currentPage === totalPages });

    return items
}

const HumanRequestTable = () => {
    // Hold internal states
    const [data, setData] = React.useState<any[]>([])
    const [page, setPage] = React.useState<number>(1)
    const [limit] = React.useState<number>(10)
    const [totalData, setTotalData] = React.useState<number>(0)
    const [title, setTitle] = React.useState<string>('')
    const [category, setCategory] = React.useState<string>('')
    const [status, setStatus] = React.useState<string>('')
    const [user, setUser] = React.useState<string>('')
    const [sortRequestUpdate, setSortRequestUpdate] = React.useState<string>('desc')

    const maxPage = React.useMemo(() => Math.ceil(totalData / limit), [limit, totalData])

    React.useEffect(() => {
        toast.promise(async () => {
            const query = [
                `page=${page}`,
                `limit=${limit}`,
                `projection=updatedAt,histories,chat.title,chat.user.name,chat.user.avatar,chat.user.email,chat.user.id,chat.item.name`
            ]

            if (title) query.push(`title=${title}`)
            if (category) query.push(`category=${category}`)
            if (status) query.push(`status=${status}`)
            if (user) query.push(`userId=${user}`)
            if (sortRequestUpdate) query.push(`sort=updatedAt:desc`)

            const response = await axiosInstance.get(`api/v1/admin-tools/human-request?${query.join('&')}`)
            return response.data
        }, {
            loading: 'Loading human request',
            success: data => {
                setData(data.data)
                setTotalData(data.metadata.total)
                return 'Human request loaded'
            },
            error: 'An error occured'
        })
    }, [page, limit, title, category, status, user, sortRequestUpdate])

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[250px]">
                            <TableHeadUser selected={user} setSelected={setUser} />
                        </TableHead>
                        <TableHead className="w-[200px]">
                            <TableHeadCategory selected={category} setSelected={setCategory} />
                        </TableHead>
                        <TableHead>
                            <TableHeadTitle setTitle={setTitle} />
                        </TableHead>
                        <TableHead className="w-[100px]">
                            <TableHeadStatus selected={status} setSelected={setStatus} />
                        </TableHead>
                        <TableHead className="w-[150px]">
                            <TableHeadlastRequestUpdate sort={sortRequestUpdate} setSort={setSortRequestUpdate} />
                        </TableHead>
                        <TableHead className="w-[150px]">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(hr => {
                        const status = hr.histories.slice(-1)[0].status || 'Unknown'
                        const badgeColor =
                            status === 'Pending' ? 'bg-red-500' :
                            status === 'Assigned' ? 'bg-orange-500' :
                            status === 'In Progress' ? 'bg-blue-500' :
                            status === 'In Review' ? 'bg-yellow-500' :
                            status === 'QC Revision' ? 'bg-red-500' :
                            status === 'QC Accepted' ? 'bg-green-500' :
                            status === 'User Revision' ? 'bg-red-500' :
                            status === 'Completed' ? 'bg-green-500' : 'bg-black'
                        return (
                        <TableRow>
                            <TableCell>
                                <div className="flex gap-2 items-center">
                                    <img src={hr.chat.user.avatar || `https://ui-avatars.com/api?name=${hr.chat.user.name}`} className="w-6 h-6 rounded-full" />
                                    <div className="flex flex-col">
                                        <p>{hr.chat.user.name}</p>
                                        <p className="text-xs text-neutral-500">{hr.chat.user.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{hr.chat.item.name}</TableCell>
                            <TableCell>{hr.chat.title}</TableCell>
                            <TableCell><Badge className={badgeColor}>{status}</Badge></TableCell>
                            <TableCell>{dateToWhatsappKindaFormat(new Date(hr.updatedAt))}</TableCell>
                            <TableCell><Button onClick={() => window.open(`/app/admin/human-request/${hr.id}`)}>View Detail</Button></TableCell>
                        </TableRow>
                    )})}
                </TableBody>
            </Table>
            <div>
                <ButtonGroup>
                    {buildPagination(page, maxPage).map(item => {
                        if (item.type === 'first') return <Button disabled={page === 1} size='sm' variant='ghost' onClick={() => setPage(1)}><ChevronsLeft /></Button>
                        if (item.type === 'prev') return <Button disabled={page === 1} size='sm' variant='ghost'><ChevronLeft /></Button>
                        if (item.type === 'page') return <Button disabled={page === item.page} size='sm' variant='ghost'>{item.page}</Button>
                        if (item.type === 'next') return <Button disabled={page === maxPage} size='sm' variant='ghost'><ChevronRight /></Button>
                        if (item.type === 'last') return <Button disabled={page === maxPage} size='sm' variant='ghost'><ChevronsRight /></Button>
                        if (item.type === 'ellipsis') return <Button size='sm' variant='ghost' disabled><Ellipsis /></Button>
                    })}
                </ButtonGroup>
            </div>
        </div>
    )
}

export default HumanRequestTable