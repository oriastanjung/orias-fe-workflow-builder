
import React from 'react'
import { toast } from 'sonner'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import axiosInstance from '@/lib/axios'

const InvoiceList = () => {
    // Hold internal states
    const [invoices, setInvoices] = React.useState<any[]>([])
    const [page] = React.useState<number>(1)

    // Load invoice list on mount and every page changes
    React.useEffect(() => {
        toast.promise(async () => {
            const response = await axiosInstance.get(`/api/v1/subscription-tools/invoice?page=${1}&limit=10&sort=createdAt:desc`)
            return response.data.data
        }, {
            loading: 'Loading invoices',
            success: data => {
                setInvoices(data)
                return 'Invoice loaded'
            },
            error: 'An error occured'
        })
    }, [page])

    return (
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className='w-[100px]'>Invoice</TableHead>
                    <TableHead>Date Issued</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Amount</TableHead>
                    {/* <TableHead>Plan</TableHead> */}
                    {/* <TableHead></TableHead> */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map(invoice => (
                    <TableRow key={invoice.id}>
                        <TableCell className='font-medium'>{invoice.invoiceNumber}</TableCell>
                        <TableCell>{new Date(invoice.createdAt).toLocaleString('en-ID', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</TableCell>
                        <TableCell>{invoice.isPaid ? 'Paid' : new Date() > new Date (invoice.expiredAt) ? 'Expired' : 'Unpaid'}</TableCell>
                        <TableCell className='text-right'>{invoice.currency || 'IDR'} {(invoice.total).toLocaleString('en-ID', { currency: invoice.currency || 'IDR' })}</TableCell>
                        {/* <TableCell>Skecth</TableCell> */}
                        {/* <TableCell><Button variant='link'>Download</Button></TableCell> */}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default InvoiceList