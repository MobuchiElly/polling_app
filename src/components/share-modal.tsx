'use client';

import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Download} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  pollId: string;
  pollTitle: string;
}

export function ShareModal({
  isOpen,
  onClose,
  pollId,
  pollTitle,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // Generate a unique share link
  const shareLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/polls/${pollId}`;
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Share link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const qrCanvas = qrRef.current?.querySelector('canvas') as HTMLCanvasElement;
    if (qrCanvas) {
      const link = document.createElement('a');
      link.href = qrCanvas.toDataURL('image/png');
      link.download = `poll-${pollId}-qr.png`;
      link.click();
      toast.success("QR code saved to your device");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Poll</DialogTitle>
          <DialogDescription>
            Share &quot;<span className="font-bold">{pollTitle}</span>&quot; with others via link or QR code
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Share Link
            </label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={shareLink}
                className="flex-1 bg-secondary text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="icon"
                className="shrink-0 bg-transparent"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-primary">Link copied to clipboard!</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              QR Code
            </label>
            <div
              ref={qrRef}
              className="flex items-center justify-center rounded-lg bg-secondary p-6"
            >
              <QRCodeSVG
                value={shareLink}
                size={180}
                level="H"
                includeMargin={true}
                fgColor="#ffffff"
                bgColor="blue"
              />
            </div>
            <Button
              onClick={handleDownloadQR}
              variant="outline"
              className="w-full bg-transparent"
            >
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </div>

          <div className="rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">💡 Sharing Tips:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Share the link directly with friends</li>
              <li>Print or screenshot the QR code</li>
              <li>Post the link on social media</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
