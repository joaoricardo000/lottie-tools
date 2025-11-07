import './App.css';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { Timeline } from './components/Timeline';
import { PropertiesPanel } from './components/PropertiesPanel';
import { LayersPanel } from './components/LayersPanel';
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="app">
      <Toolbar />
      <div className="app-body">
        <LayersPanel />
        <div className="app-center">
          <Canvas />
          <Timeline />
        </div>
        <PropertiesPanel />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
