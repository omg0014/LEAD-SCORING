import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const LeadTable = ({ leads }) => {
    if (leads.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                No active signals detected.
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[60px] text-center">Rank</TableHead>
                        <TableHead>Lead Identity</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leads.map((lead, index) => (
                        <TableRow key={lead._id}>
                            <TableCell className="font-mono text-center font-bold text-muted-foreground">
                                {String(index + 1).padStart(2, '0')}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full border bg-muted/20 flex items-center justify-center text-xs font-mono text-muted-foreground">
                                        {lead._id.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="font-mono font-medium">{lead._id}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="font-mono text-primary bg-primary/10 hover:bg-primary/20 border-0">
                                    {lead.score} XP
                                </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-mono">
                                {lead.updatedAt ? new Date(lead.updatedAt).toLocaleTimeString() : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                                    <Link to={`/leads/${lead._id}`}>
                                        Analyze <ArrowUpRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default LeadTable;
