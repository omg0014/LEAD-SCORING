import React, { useEffect, useState } from 'react';
import { ArrowLeft, Save, Loader2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RulesConfig = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/rules');
            setRules(res.data);
        } catch (err) {
            console.error('Failed to fetch rules', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePointChange = (eventType, newPoints) => {
        setRules(rules.map(rule =>
            rule.eventType === eventType ? { ...rule, points: Number(newPoints) } : rule
        ));
    };

    const saveRule = async (rule) => {
        setSaving(true);
        try {
            await axios.post('http://localhost:5001/api/rules', {
                eventType: rule.eventType,
                points: rule.points,
                isActive: rule.isActive
            });
            alert(`Updated ${rule.eventType}`);
        } catch (err) {
            alert('Failed to update rule');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-8 p-4 md:p-8">
            <div>
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                    <ArrowLeft size={16} /> Return to Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Scoring Protocol</h1>
                        <p className="text-muted-foreground mt-1">
                            Configure point vectors for event processing.
                        </p>
                    </div>
                    <Badge variant="outline" className="font-mono">v1.0.0</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <Card className="md:col-span-2 border-border bg-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" /> Active Rules
                        </CardTitle>
                        <CardDescription>Adjust multiplier values for incoming signals.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {rules.map((rule) => (
                                    <div key={rule._id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/10 transition-colors hover:bg-muted/20">
                                        <div className="flex flex-col">
                                            <span className="font-mono font-bold text-sm text-foreground">{rule.eventType}</span>
                                            <span className="text-xs text-muted-foreground">Global Trigger</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 bg-background p-1 rounded-md border">
                                                <span className="text-xs text-muted-foreground pl-2">XP</span>
                                                <Input
                                                    type="number"
                                                    className="h-7 w-20 text-right border-0 focus-visible:ring-0 p-0 pr-2 font-mono"
                                                    value={rule.points}
                                                    onChange={(e) => handlePointChange(rule.eventType, e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => saveRule(rule)}
                                                disabled={saving}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Save size={16} className="text-muted-foreground hover:text-primary transition-colors" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-muted/10 border-dashed">
                    <CardHeader>
                        <CardTitle className="text-sm">Configuration Guide</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground space-y-4 font-mono">
                        <p>
                            Changes to scoring rules are applied immediately to all <strong>future</strong> events.
                        </p>
                        <p>
                            Historical scores are immutable to preserve audit integrity.
                        </p>
                        <div className="p-3 bg-background rounded border">
                            <h4 className="font-bold text-foreground mb-1">Tip</h4>
                            <p>High-value actions like "Purchase" should be at least 10x "Page View".</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RulesConfig;
