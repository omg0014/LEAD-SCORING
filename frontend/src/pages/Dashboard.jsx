import React, { useEffect, useState } from 'react';
import { getLeads } from '../services/api';
import LeadTable from '../components/LeadTable';
import EventForm from '../components/EventForm';
import BatchUpload from '../components/BatchUpload';
import { io } from 'socket.io-client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RefreshCcw, Search } from 'lucide-react';

const Dashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [minScore, setMinScore] = useState('');
    const [maxScore, setMaxScore] = useState('');
    const [limit, setLimit] = useState(10);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const data = await getLeads();
            setLeads(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();

        // Socket.IO Connection
        const socket = io(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001');

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('leadUpdated', (data) => {
            console.log('Real-time update:', data);
            fetchLeads();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Filter Logic
    const filteredLeads = leads
        .filter(lead => {
            const matchesSearch = lead._id.toLowerCase().includes(searchQuery.toLowerCase());
            const score = lead.score;
            const matchesMin = minScore === '' || score >= Number(minScore);
            const matchesMax = maxScore === '' || score <= Number(maxScore);
            return matchesSearch && matchesMin && matchesMax;
        })
        .slice(0, limit);

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Live Intelligence</h2>
                    <p className="text-muted-foreground mt-1">Real-time scoring updates and lead ranking.</p>
                </div>
                <Button variant="outline" onClick={fetchLeads} className="gap-2">
                    <RefreshCcw className="h-4 w-4" /> Refresh
                </Button>
            </div>

            {/* Filter Controls */}
            <Card className="border-border bg-card">
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Search ID</label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Min Score</label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={minScore}
                            onChange={(e) => setMinScore(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Max Score</label>
                        <Input
                            type="number"
                            placeholder="∞"
                            value={maxScore}
                            onChange={(e) => setMaxScore(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Display Limit</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                        >
                            <option value={5}>Top 5</option>
                            <option value={10}>Top 10</option>
                            <option value={50}>Top 50</option>
                            <option value={100}>Top 100</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="h-64 rounded-xl border bg-card/50 animate-pulse" />
                    ) : (
                        <LeadTable leads={filteredLeads} />
                    )}
                </div>

                <div className="space-y-4">
                    <EventForm onEventSent={fetchLeads} />
                    <BatchUpload onUploadComplete={fetchLeads} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
