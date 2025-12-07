import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"

const TableHeadlastRequestUpdate = ({ sort, setSort }: { sort: string, setSort: React.Dispatch<React.SetStateAction<string>> }) => {
    return (
        <div className="flex items-center justify-between">
            <p>Last Request update</p>
            {sort === 'desc' && <ChevronDown fill="gray" stroke="none" size={12} onClick={() => setSort('asc')} />}
            {sort === 'asc' && <ChevronUp fill="gray" stroke="none" size={12} onClick={() => setSort('')}/>}
            {sort === '' && <ChevronsUpDown fill="gray" stroke="none" size={12} onClick={() => setSort('desc')}/>}
        </div>
    )
}

export default TableHeadlastRequestUpdate