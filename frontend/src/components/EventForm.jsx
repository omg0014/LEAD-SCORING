import React, { useState } from 'react';
import { sendEvent } from '../services/api';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EventForm = ({ onEventSent }) => {
    const [formData, setFormData] = useState({
        leadId: '',
        eventType: 'Page View',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            await sendEvent({
                eventId,
                leadId: formData.leadId,
                eventType: formData.eventType,
                timestamp: new Date().toISOString(),
                metadata: { source: 'dashboard_manual' }
            });
            setFormData({ ...formData, leadId: '' });
            if (onEventSent) onEventSent();
        } catch (err) {
            console.error(err);
            alert('Failed to send event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-border bg-card">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium">Simulate Event</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Lead ID</label>
                        <Input
                            type="text"
                            required
                            placeholder="e.g. user_123"
                            value={formData.leadId}
                            onChange={e => setFormData({ ...formData, leadId: e.target.value })}
                            className="bg-muted/10 font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Event Type</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.eventType}
                            onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                        >
                            <option>Page View</option>
                            <option>Email Open</option>
                            <option>Form Submission</option>
                            <option>Demo Request</option>
                            <option>Purchase</option>
                        </select>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Send Test Event'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default EventForm;
