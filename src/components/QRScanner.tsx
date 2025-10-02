import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  placeId?: string;
  businessId?: string;
  placeName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const QRScanner = ({ placeId, businessId, placeName, onClose, onSuccess }: QRScannerProps) => {
  const { toast } = useToast();
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        console.log('QR Code scanned:', decodedText);
        setScanning(false);
        scanner.clear();

        try {
          const body: any = { qrCode: decodedText };
          if (placeId) body.placeId = placeId;
          if (businessId) body.businessId = businessId;

          const { data, error } = await supabase.functions.invoke('process-qr-scan', {
            body,
          });

          if (error) throw error;

          if (data.error) {
            toast({
              title: "Error",
              description: data.error,
              variant: data.alreadyScanned ? "default" : "destructive",
            });
            onClose();
            return;
          }

          if (data.rewardEarned) {
            toast({
              title: "🎉 ¡Felicitaciones!",
              description: data.message,
              duration: 5000,
            });
          } else {
            toast({
              title: "✅ Punto acumulado",
              description: data.message,
            });
          }

          onSuccess();
          onClose();
        } catch (error: any) {
          console.error('Error processing QR:', error);
          toast({
            title: "Error",
            description: "No se pudo procesar el código QR",
            variant: "destructive",
          });
          onClose();
        }
      },
      (errorMessage) => {
        // Ignore scanning errors (they happen continuously)
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [placeId, onClose, onSuccess, toast]);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Escanear QR en {placeName}</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div id="qr-reader" className="w-full"></div>
          
          {scanning && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Apunta la cámara al código QR del establecimiento
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;
