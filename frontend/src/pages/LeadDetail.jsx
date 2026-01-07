import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLead } from '../services/api';
import { ArrowLeft, Activity, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LeadDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const res = await getLead(id);
                setData(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLead();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-muted-foreground">Initializing Data Stream...</div>;
    if (!data) return <div className="p-8 text-center text-destructive">Target Not Found</div>;

    const { lead, history, events } = data;

    // Format history for chart
    const chartData = history.slice().reverse().map(h => ({
        name: new Date(h.timestamp).toLocaleTimeString(),
        score: h.newScore,
        delta: h.delta,
        event: h.eventType
    }));

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
            <div>
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                    <ArrowLeft size={16} /> Return to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight font-mono">{lead._id}</h1>
                        <p className="text-xs text-muted-foreground mt-2 font-mono flex items-center gap-2">
                            <Calendar className="h-3 w-3" /> LAST ACTIVE: {new Date(lead.updatedAt).toLocaleString().toUpperCase()}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Current XP</div>
                        <div className="text-5xl font-black text-primary tracking-tighter tabular-nums drop-shadow-md">
                            {lead.score}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-2 border-border bg-card">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" /> Performance Velocity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--popover))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                        color: 'hsl(var(--popover-foreground))',
                                        fontFamily: 'monospace',
                                        fontSize: '12px'
                                    }}
                                    itemStyle={{ color: 'hsl(var(--primary))' }}
                                />
                                <Line
                                    type="stepAfter"
                                    dataKey="score"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Event Log</CardTitle>
                        <CardDescription>Recent activity stream.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 relative pl-4 border-l border-border">
                            {events.map((evt) => (
                                <div key={evt.eventId} className="relative">
                                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-mono text-muted-foreground">
                                            {new Date(evt.timestamp).toLocaleTimeString()}
                                        </span>
                                        <span className="text-sm font-medium">{evt.eventType}</span>
                                        <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 w-fit px-1 rounded">
                                            {evt.eventId.substring(0, 8)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LeadDetail;
