import React, { useRef, useState } from 'react';
import { Upload, FileJson, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const BatchUpload = ({ onUploadComplete }) => {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isJson = file.type === 'application/json' || file.name.endsWith('.json');
        const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');

        if (!isJson && !isCsv) {
            alert('Please upload a JSON or CSV file');
            return;
        }

        setUploading(true);

        if (isJson) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const events = JSON.parse(event.target.result);
                    await uploadBatch(events);
                } catch (err) {
                    alert('Invalid JSON file');
                    setUploading(false);
                }
            };
            reader.readAsText(file);
        } else if (isCsv) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    // Check if there is data
                    if (!results.data || results.data.length === 0) {
                        alert('CSV file is empty');
                        setUploading(false);
                        return;
                    }

                    const events = results.data.map(row => ({
                        eventId: row.eventId || `evt_${Math.random().toString(36).substr(2, 9)}`,
                        leadId: row.leadId,
                        eventType: row.eventType,
                        timestamp: row.timestamp || new Date().toISOString(),
                        metadata: { source: 'csv_upload', ...row }
                    })).filter(e => e.leadId && e.eventType);

                    await uploadBatch(events);
                },
                error: (err) => {
                    console.error(err);
                    alert('Failed to parse CSV');
                    setUploading(false);
                }
            });
        }
    };

    const uploadBatch = async (events) => {
        try {
            if (events.length === 0) {
                alert('No valid events found in file');
                return;
            }
            const res = await axios.post('http://localhost:5001/api/events/batch', events);
            alert(res.data.message);
            if (onUploadComplete) onUploadComplete();
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            console.error(err);
            alert('Batch upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className="mt-4 border-border bg-card">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Batch Import
                </CardTitle>
                <CardDescription className="text-xs">
                    JSON or CSV supported
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div
                    className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/10"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".json,.csv"
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <p className="text-xs text-muted-foreground">Processing...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex gap-2">
                                <FileJson className="h-5 w-5 text-muted-foreground" />
                                <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground">Click to upload</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default BatchUpload;
