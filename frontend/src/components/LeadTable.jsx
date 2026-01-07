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
                        <TableRow key={lead._id} className="transition-all duration-200 hover:translate-x-1 hover:bg-muted/30 border-b border-border/50 group">
                            <TableCell className="font-mono text-center font-bold text-muted-foreground text-sm">
                                {String(index + 1).padStart(2, '0')}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <div className="h-9 w-9 rounded-full border border-white/10 bg-muted/20 flex items-center justify-center text-sm font-bold font-mono text-primary shadow-sm group-hover:scale-110 transition-transform">
                                        {lead._id.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="font-mono font-semibold text-base tracking-tight">{lead._id}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="font-mono text-primary bg-primary/15 hover:bg-primary/25 border-0 text-sm px-2.5 py-0.5">
                                    {lead.score} XP
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground font-mono">
                                {lead.updatedAt ? new Date(lead.updatedAt).toLocaleTimeString() : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-white/10 hover:bg-primary hover:text-primary-foreground transition-colors" asChild>
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
