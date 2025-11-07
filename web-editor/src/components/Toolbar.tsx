import './Toolbar.css';
import { useState } from 'react';
import { FileImport } from './FileImport';
import { ExportDialog } from './ExportDialog';
import { useStore } from '../store/useStore';
import { LottieExporter } from '../export/LottieExporter';
import { LottieValidator } from '../utils/lottie-validator';
import type { LottieAnimation } from '../models/LottieTypes';

export function Toolbar() {
  const project = useStore((state) => state.project);
  const [exportDialog, setExportDialog] = useState<{
    lottie: LottieAnimation;
    filename: string;
    validationMessage: string;
  } | null>(null);

  const handleExport = () => {
    if (!project) {
      alert('No project to export');
      return;
    }

    if (project.layers.length === 0) {
      alert('Project has no layers. Please add some content before exporting.');
      return;
    }

    try {
      // Export to Lottie format
      const lottie = LottieExporter.exportToLottie(project);

      // Validate before showing dialog
      const validation = LottieValidator.validateWithMessage(lottie);

      if (!validation.valid) {
        alert(`Export validation failed:\n\n${validation.message}`);
        return;
      }

      // Show export dialog with validation message
      setExportDialog({
        lottie,
        filename: project.name || 'animation',
        validationMessage: validation.message,
      });
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export animation. Check console for details.');
    }
  };

  return (
    <>
      <div className="toolbar">
        <h1 className="toolbar-title">Lottie Open Studio</h1>
        <div className="toolbar-actions">
          <FileImport />
          <button disabled>Import Lottie</button>
          <button onClick={handleExport} disabled={!project || project.layers.length === 0}>
            Export to Lottie
          </button>
        </div>
      </div>

      {exportDialog && (
        <ExportDialog
          lottieJson={exportDialog.lottie}
          defaultFilename={exportDialog.filename}
          validationMessage={exportDialog.validationMessage}
          onClose={() => setExportDialog(null)}
        />
      )}
    </>
  );
}
