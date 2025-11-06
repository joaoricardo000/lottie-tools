import './Toolbar.css';
import { FileImport } from './FileImport';

export function Toolbar() {
  return (
    <div className="toolbar">
      <h1 className="toolbar-title">Lottie Open Studio</h1>
      <div className="toolbar-actions">
        <FileImport />
        <button>Import Lottie</button>
        <button>Export</button>
      </div>
    </div>
  );
}
