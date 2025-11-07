import { useState } from 'react';
import './ExportDialog.css';
import type { LottieAnimation } from '../models/LottieTypes';

interface ExportDialogProps {
  lottieJson: LottieAnimation;
  defaultFilename: string;
  validationMessage: string;
  onClose: () => void;
}

export function ExportDialog({ lottieJson, defaultFilename, validationMessage, onClose }: ExportDialogProps) {
  const [filename, setFilename] = useState(defaultFilename);
  const [copySuccess, setCopySuccess] = useState(false);

  const jsonString = JSON.stringify(lottieJson, null, 2);

  const handleDownload = () => {
    try {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.endsWith('.json') ? filename : `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Copy error:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isValidLottie = validationMessage === 'Valid Lottie JSON';
  const hasWarnings = !isValidLottie && validationMessage.includes('Valid, but with warnings');

  return (
    <div className="export-dialog-overlay" onClick={handleOverlayClick}>
      <div className="export-dialog">
        <div className="export-dialog-header">
          <h2>Export to Lottie JSON</h2>
          <button className="export-dialog-close" onClick={onClose} title="Close">
            ×
          </button>
        </div>

        {!isValidLottie && (
          <div className={`export-dialog-validation ${hasWarnings ? 'warning' : 'error'}`}>
            <strong>{hasWarnings ? 'Warning:' : 'Error:'}</strong>
            <pre>{validationMessage}</pre>
          </div>
        )}

        <div className="export-dialog-body">
          <div className="export-dialog-field">
            <label htmlFor="filename">Filename:</label>
            <input
              id="filename"
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="animation.json"
            />
          </div>

          <div className="export-dialog-field">
            <label htmlFor="json-preview">JSON Preview:</label>
            <textarea
              id="json-preview"
              value={jsonString}
              readOnly
              spellCheck={false}
            />
          </div>
        </div>

        <div className="export-dialog-footer">
          <button onClick={handleCopyToClipboard} className="secondary">
            {copySuccess ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
          <button onClick={handleDownload} className="primary">
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
