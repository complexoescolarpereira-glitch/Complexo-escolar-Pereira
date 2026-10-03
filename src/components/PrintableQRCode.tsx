import React, { useState } from 'react';
import { Printer, X, Download, QrCode, Sparkles, School, ShieldCheck, CheckCircle } from 'lucide-react';

interface PrintableQRCodeProps {
  onClose: () => void;
  portalUrl: string;
}

export const PrintableQRCode: React.FC<PrintableQRCodeProps> = ({ onClose, portalUrl }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      try {
        window.focus();
        window.print();
      } catch (e) {
        console.error('Print error:', e);
      } finally {
        setTimeout(() => setIsPrinting(false), 2000);
      }
    }, 150);
  };

  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 1600);

    // Outer decorative border
    ctx.strokeStyle = '#04063f';
    ctx.lineWidth = 14;
    ctx.strokeRect(40, 40, 1120, 1520);

    // Inner gold/orange border
    ctx.strokeStyle = '#fd761a';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, 1080, 1480);

    // Header section
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('REPÚBLICA DE ANGOLA • PROVÍNCIA DO CUANZA SUL', 600, 130);

    ctx.fillStyle = '#04063f';
    ctx.font = 'bold 44px Georgia, serif';
    ctx.fillText('COMPLEXO ESCOLAR PRIVADO PEREIRA', 600, 195);

    ctx.fillStyle = '#475569';
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText('Instituto de Ensino de Excelência • Ensino Primário (Iniciação à 6.ª Classe)', 600, 240);

    ctx.fillStyle = '#fd761a';
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillText('“Surgimos para formar quadros de excelência”', 600, 285);

    // Divider line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 320);
    ctx.lineTo(1100, 320);
    ctx.stroke();

    // Badge
    ctx.fillStyle = '#eaedff';
    ctx.beginPath();
    ctx.roundRect(400, 360, 400, 48, 24);
    ctx.fill();

    ctx.fillStyle = '#04063f';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('ÁREA PUBLICITÁRIA & MATRÍCULA VIRTUAL', 600, 392);

    // Callout
    ctx.fillStyle = '#04063f';
    ctx.font = 'bold 38px system-ui, sans-serif';
    ctx.fillText('Aponte a Câmera do Telemóvel', 600, 465);

    ctx.fillStyle = '#64748b';
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText('Aceda instantaneamente às informações escolares, galeria de actividades', 600, 510);
    ctx.fillText('e submissão oficial de matrículas online para o ano lectivo.', 600, 540);

    // QR Box background
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(325, 590, 550, 550, 30);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw QR pattern on canvas
    const drawQR = (ox: number, oy: number, s: number) => {
      const qColor = '#04063f';
      const oColor = '#fd761a';

      // Corner 1
      ctx.fillStyle = qColor;
      ctx.beginPath();
      ctx.roundRect(ox + 40, oy + 40, 110, 110, 16);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(ox + 65, oy + 65, 60, 60, 8);
      ctx.fill();
      ctx.fillStyle = oColor;
      ctx.beginPath();
      ctx.roundRect(ox + 80, oy + 80, 30, 30, 6);
      ctx.fill();

      // Corner 2
      ctx.fillStyle = qColor;
      ctx.beginPath();
      ctx.roundRect(ox + 320, oy + 40, 110, 110, 16);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(ox + 345, oy + 65, 60, 60, 8);
      ctx.fill();
      ctx.fillStyle = oColor;
      ctx.beginPath();
      ctx.roundRect(ox + 360, oy + 80, 30, 30, 6);
      ctx.fill();

      // Corner 3
      ctx.fillStyle = qColor;
      ctx.beginPath();
      ctx.roundRect(ox + 40, oy + 320, 110, 110, 16);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(ox + 65, oy + 345, 60, 60, 8);
      ctx.fill();
      ctx.fillStyle = oColor;
      ctx.beginPath();
      ctx.roundRect(ox + 80, oy + 360, 30, 30, 6);
      ctx.fill();

      // Center pattern & blocks
      ctx.fillStyle = qColor;
      const dots = [
        [180, 60, 24, 24], [230, 60, 24, 24], [280, 60, 24, 24],
        [200, 110, 24, 24], [250, 110, 24, 24],
        [60, 180, 24, 24], [110, 210, 24, 24], [60, 260, 24, 24],
        [180, 180, 36, 36], [240, 180, 24, 24], [290, 190, 30, 30],
        [220, 240, 24, 24], [180, 290, 24, 24], [230, 290, 24, 24],
        [360, 190, 24, 24], [410, 190, 24, 24], [360, 240, 24, 24],
        [430, 240, 24, 24], [390, 290, 24, 24], [430, 290, 24, 24],
        [180, 360, 24, 24], [230, 360, 24, 24], [280, 360, 24, 24],
        [200, 410, 24, 24], [250, 410, 24, 24], [300, 410, 24, 24],
        [360, 360, 24, 24], [410, 360, 24, 24], [390, 410, 24, 24]
      ];
      dots.forEach(([x, y, w, h]) => {
        ctx.beginPath();
        ctx.roundRect(ox + x, oy + y, w, h, 4);
        ctx.fill();
      });

      // Orange accents in center
      ctx.fillStyle = oColor;
      ctx.beginPath();
      ctx.roundRect(ox + 270, oy + 240, 34, 34, 6);
      ctx.fill();
    };

    drawQR(365, 630, 1);

    // Callout beneath QR
    ctx.fillStyle = '#04063f';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('DISPOSITIVOS ANDROID & IPHONE', 600, 1200);

    ctx.fillStyle = '#64748b';
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText('Basta aproximar a câmara fotográfica para abrir o portal imediatamente.', 600, 1235);

    // Bottom contacts bar
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 1340);
    ctx.lineTo(1100, 1340);
    ctx.stroke();

    ctx.fillStyle = '#04063f';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SECRETARIA ESCOLAR NO CUANZA SUL', 100, 1400);

    ctx.fillStyle = '#64748b';
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText('Atendimento: Segunda a Sexta-feira • 07h30 às 16h30', 100, 1435);

    ctx.fillStyle = '#04063f';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Tel: +244 922 071 870', 1100, 1400);
    ctx.fillText('WhatsApp: +244 937 775 839', 1100, 1435);

    // Download trigger
    const link = document.createElement('a');
    link.download = 'Cartaz_A4_QR_CEP_Pereira.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 animate-in zoom-in-95 relative printable-area">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#fd761a]" />
            <span className="font-bold text-sm text-[#04063f]">Cartaz Oficial com QR Code do Portal</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-3.5 py-2 rounded-lg bg-[#04063f] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#1b1f54] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              title="Abre o diálogo de impressão do navegador ou dispositivo"
            >
              <Printer className="w-4 h-4 text-[#fd761a]" />
              <span>{isPrinting ? 'A preparar...' : 'Imprimir Cartaz A4'}</span>
            </button>

            <button
              onClick={handleDownloadPNG}
              className="px-3.5 py-2 rounded-lg bg-orange-50 border border-orange-200 text-[#fd761a] text-xs font-bold flex items-center gap-2 hover:bg-orange-100 transition-colors shadow-sm cursor-pointer"
              title="Descarregar imagem oficial em alta resolução (PNG) para imprimir ou partilhar"
            >
              {isDownloaded ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Guardado!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descarregar PNG</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Poster Canvas */}
        <div className="p-8 border-4 border-[#04063f] rounded-2xl text-slate-900 space-y-6 bg-white font-serif-headline text-center relative overflow-hidden">
          {/* Header */}
          <div className="space-y-2 border-b-2 border-slate-200 pb-4">
            <div className="text-xs uppercase tracking-widest font-sans font-bold text-slate-500">
              República de Angola • Província do Cuanza Sul
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#04063f] uppercase">
              COMPLEXO ESCOLAR PRIVADO PEREIRA
            </h1>
            <div className="text-xs font-sans text-slate-600 font-medium">
              Instituto de Ensino de Excelência • Ensino Primário (Iniciação à 6.ª Classe)
            </div>
            <div className="italic text-xs font-serif-headline text-[#fd761a]">
              “Surgimos para formar quadros de excelência”
            </div>
          </div>

          {/* Poster Callout */}
          <div className="space-y-1 font-sans">
            <span className="px-3 py-1 rounded-full bg-[#eaedff] text-[#04063f] text-xs font-bold uppercase tracking-wider inline-block">
              Área Publicitária & Matrícula Virtual
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#04063f]">
              Aponte a Câmera do Telemóvel
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Aceda instantaneamente às informações escolares, galeria de actividades e submissão de matrículas online.
            </p>
          </div>

          {/* SVG QR Code Simulation */}
          <div className="p-4 bg-white border-2 border-dashed border-slate-300 rounded-2xl inline-block shadow-inner mx-auto">
            <svg
              className="w-52 h-52 sm:w-60 sm:h-60 mx-auto text-[#04063f]"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              {/* Corner position squares */}
              <rect x="10" y="10" width="50" height="50" fill="#04063f" rx="6" />
              <rect x="20" y="20" width="30" height="30" fill="white" rx="3" />
              <rect x="28" y="28" width="14" height="14" fill="#fd761a" rx="2" />

              <rect x="140" y="10" width="50" height="50" fill="#04063f" rx="6" />
              <rect x="150" y="20" width="30" height="30" fill="white" rx="3" />
              <rect x="158" y="28" width="14" height="14" fill="#fd761a" rx="2" />

              <rect x="10" y="140" width="50" height="50" fill="#04063f" rx="6" />
              <rect x="20" y="150" width="30" height="30" fill="white" rx="3" />
              <rect x="28" y="158" width="14" height="14" fill="#fd761a" rx="2" />

              {/* QR Pattern dots */}
              <rect x="70" y="20" width="10" height="10" rx="2" />
              <rect x="90" y="20" width="10" height="10" rx="2" />
              <rect x="110" y="20" width="10" height="10" rx="2" />
              <rect x="80" y="35" width="10" height="10" rx="2" />
              <rect x="100" y="35" width="10" height="10" rx="2" />
              <rect x="120" y="35" width="10" height="10" rx="2" />

              <rect x="20" y="70" width="10" height="10" rx="2" />
              <rect x="35" y="80" width="10" height="10" rx="2" />
              <rect x="20" y="100" width="10" height="10" rx="2" />
              <rect x="35" y="110" width="10" height="10" rx="2" />

              <rect x="70" y="70" width="14" height="14" fill="#04063f" rx="3" />
              <rect x="95" y="70" width="10" height="10" rx="2" />
              <rect x="115" y="75" width="12" height="12" rx="2" />
              <rect x="85" y="95" width="10" height="10" rx="2" />
              <rect x="105" y="95" width="14" height="14" fill="#fd761a" rx="3" />
              <rect x="70" y="115" width="10" height="10" rx="2" />
              <rect x="90" y="115" width="10" height="10" rx="2" />
              <rect x="115" y="115" width="10" height="10" rx="2" />

              <rect x="145" y="75" width="10" height="10" rx="2" />
              <rect x="165" y="75" width="10" height="10" rx="2" />
              <rect x="145" y="95" width="10" height="10" rx="2" />
              <rect x="175" y="95" width="10" height="10" rx="2" />
              <rect x="155" y="115" width="10" height="10" rx="2" />
              <rect x="175" y="115" width="10" height="10" rx="2" />

              <rect x="70" y="145" width="10" height="10" rx="2" />
              <rect x="90" y="145" width="10" height="10" rx="2" />
              <rect x="110" y="145" width="10" height="10" rx="2" />
              <rect x="80" y="165" width="10" height="10" rx="2" />
              <rect x="100" y="165" width="10" height="10" rx="2" />
              <rect x="120" y="165" width="10" height="10" rx="2" />

              <rect x="145" y="145" width="10" height="10" rx="2" />
              <rect x="165" y="145" width="10" height="10" rx="2" />
              <rect x="155" y="165" width="10" height="10" rx="2" />
              <rect x="175" y="165" width="10" height="10" rx="2" />
            </svg>
          </div>

          {/* Footer of poster */}
          <div className="pt-4 border-t border-slate-200 font-sans text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-left">
              <strong>Secretaria Escolar no Cuanza Sul</strong>
              <div className="text-[10px] text-slate-400">Atendimento: 07h30 às 16h30</div>
            </div>
            <div className="font-mono text-[11px] text-right">
              <div>+244 922 071 870</div>
              <div>+244 937 775 839 (WhatsApp)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

