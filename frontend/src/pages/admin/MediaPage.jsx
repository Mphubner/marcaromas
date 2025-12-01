import React from 'react';
import UploadManager from '../../components/admin/media/UploadManager';

export default function MediaPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#8B7355]">Galeria de Mídia</h1>
                <p className="text-muted-foreground">
                    Gerencie imagens e arquivos do sistema.
                </p>
            </div>

            <UploadManager />
        </div>
    );
}
