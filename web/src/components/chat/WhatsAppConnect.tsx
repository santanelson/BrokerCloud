'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, SmartphoneNfc, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';

import { api } from '@/lib/api';

interface Props {
  onConnected: () => void;
}

export function WhatsAppConnect({ onConnected }: Props) {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'loading'>('loading');
  const [qrCode, setQrCode] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const data = await api.get('/whatsapp/status');
      
      // If we are connecting, don't revert to disconnected just because it's not LoggedIn yet
      if (data.state === 'connected') {
        setStatus('connected');
        onConnected();
      } else if (status !== 'connecting') {
        setStatus(data.state);
      }
    } catch (err) {
      console.error(err);
      if (status !== 'connecting') {
        setStatus('disconnected');
      }
    }
  };

  const handleConnect = async () => {
    setStatus('loading');
    try {
      const data = await api.post('/whatsapp/connect', {});
      setStatus(data.state);
      if (data.qrCode) {
        setQrCode(data.qrCode);
      }
    } catch (err) {
      console.error(err);
      setStatus('disconnected');
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Polling depending on status
    let interval: NodeJS.Timeout;
    if (status === 'connecting') {
      interval = setInterval(() => {
        fetchStatus();
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, onConnected]);

  if (status === 'loading') {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center p-6">
      <div className="w-full max-w-md shadow-lg border-outline-variant bg-surface rounded-xl overflow-hidden">
        <div className="text-center pb-2 p-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <SmartphoneNfc className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-on-surface">
            Conecte seu WhatsApp
          </h3>
          <p className="text-base mt-2 text-on-surface-variant">
            Para utilizar o Chat, vincule o WhatsApp corporativo da sua imobiliária lendo o QR Code abaixo.
          </p>
        </div>
        <div className="flex flex-col items-center pt-2 pb-8 px-6">
          {status === 'disconnected' && !qrCode ? (
            <Button onClick={handleConnect} size="lg" className="w-full text-lg h-14">
              Gerar QR Code de Acesso
            </Button>
          ) : (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="rounded-xl bg-white p-4 shadow-sm border border-outline-variant">
                {qrCode ? (
                  // Removing the data:image prefix if evolution go returns it, or adding it if it doesn't
                  <img 
                    src={qrCode.startsWith('data:image') ? qrCode : `data:image/png;base64,${qrCode}`} 
                    alt="WhatsApp QR Code" 
                    className="h-64 w-64 object-contain"
                  />
                ) : (
                  <div className="h-64 w-64 flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
              <p className="mt-6 text-sm text-on-surface-variant text-center animate-pulse">
                Abra o WhatsApp no seu celular, vá em Aparelhos Conectados e aponte a câmera.
              </p>
              <Button variant="outline" className="mt-4" onClick={fetchStatus}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar QR Code
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
