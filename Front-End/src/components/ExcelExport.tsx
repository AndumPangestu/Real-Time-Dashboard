import React, { useState } from 'react';
import { FileDown } from 'lucide-react';


export const ExportPanel: React.FC = () => {

    const exportSensorData = async (): Promise<void> => {
        try {
            const response = await fetch('http://localhost:5500/api/sensors/export', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.statusText}`);
            }

            // Mendapatkan file sebagai blob
            const blob = await response.blob();

            // Membuat URL untuk file blob
            const url = window.URL.createObjectURL(blob);

            // Membuat elemen <a> untuk memicu download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'data.xlsx'); // Nama file
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Membersihkan URL
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    };



    const [isExporting, setIsExporting] = useState(false);


    const handleExport = async () => {
        try {
            setIsExporting(true);
            await exportSensorData();
        } catch (error) {
            console.error('Export failed:', error);
            // You might want to show an error notification here
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-white ${isExporting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    <FileDown className="w-4 h-4 mr-2" />
                    {isExporting ? 'Exporting...' : 'Export to Excel'}
                </button>
            </div>
        </div>
    );
};