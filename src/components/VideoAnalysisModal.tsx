import { Modal } from './ui/Modal';
import { VideoAnalyzer } from './VideoAnalyzer';
import { Video } from 'lucide-react';

interface VideoAnalysisModalProps {
    onClose: () => void;
}

export function VideoAnalysisModal({ onClose }: VideoAnalysisModalProps) {
    return (
        <Modal size="lg" onClose={onClose}>
            <Modal.Header>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3b82f61a] rounded-lg">
                        <Video className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-text-primary">Análise de Vídeo com IA</h2>
                        <p className="text-sm text-text-muted">Transforme vídeos em templates de prompt</p>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body className="p-6">
                <VideoAnalyzer onClose={onClose} />
            </Modal.Body>
        </Modal>
    );
}
