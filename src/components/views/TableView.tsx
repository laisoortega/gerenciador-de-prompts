import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
} from '@tanstack/react-table';
import { Prompt } from '../../types';
import { MoreHorizontal, Share2, Copy, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TableViewProps {
    prompts: Prompt[];
    onShare: (prompt: Prompt) => void;
}

const columnHelper = createColumnHelper<Prompt>();

export const TableView: React.FC<TableViewProps> = ({ prompts, onShare }) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const columns = useMemo(() => [
        columnHelper.accessor('title', {
            header: ({ column }) => {
                return (
                    <button
                        className="flex items-center gap-1 hover:text-text-primary"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        Título
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                    </button>
                )
            },
            cell: info => <span className="font-medium text-text-primary">{info.getValue()}</span>,
        }),
        columnHelper.accessor('category.name', {
            header: 'Categoria',
            cell: info => (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#3b82f61a] text-primary-500">
                    {info.getValue() || 'Geral'}
                </span>
            ),
        }),
        columnHelper.accessor('tags', {
            header: 'Tags',
            cell: info => (
                <div className="flex gap-1 flex-wrap">
                    {info.getValue().slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-bg-elevated px-1.5 py-0.5 rounded text-text-muted">
                            {tag}
                        </span>
                    ))}
                    {info.getValue().length > 3 && (
                        <span className="text-[10px] text-text-muted">+{info.getValue().length - 3}</span>
                    )}
                </div>
            ),
        }),
        columnHelper.accessor('updated_at', {
            header: 'Atualizado em',
            cell: info => <span className="text-text-secondary text-sm">{format(new Date(info.getValue()), "d MMM, yyyy", { locale: ptBR })}</span>,
        }),
        columnHelper.display({
            id: 'actions',
            cell: props => (
                <div className="flex justify-end gap-2">
                    <button onClick={() => onShare(props.row.original)} className="p-1 hover:bg-bg-hover rounded text-text-secondary hover:text-text-primary">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-bg-hover rounded text-text-secondary hover:text-text-primary">
                        <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-bg-hover rounded text-text-secondary hover:text-text-primary">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            ),
        }),
    ], [onShare]);

    const table = useReactTable({
        data: prompts,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="rounded-md border border-border-subtle overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-bg-surface border-b border-border-subtle text-text-muted font-medium">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="px-4 py-3 font-normal">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-border-subtle bg-bg-base">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-bg-hover transition-colors">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="h-24 text-center text-text-muted">
                                Nenhum resultado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {prompts.length > 10 && (
                <div className="flex items-center justify-end space-x-2 py-4 px-4 border-t border-border-subtle">
                    <button
                        className="px-3 py-1 border border-border-default rounded text-sm disabled:opacity-50"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </button>
                    <button
                        className="px-3 py-1 border border-border-default rounded text-sm disabled:opacity-50"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
};
