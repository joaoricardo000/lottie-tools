import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportDialog } from './ExportDialog';
import type { LottieAnimation } from '../models/LottieTypes';

describe('ExportDialog', () => {
  const mockLottie: LottieAnimation = {
    v: '5.5.7',
    fr: 30,
    ip: 0,
    op: 60,
    w: 800,
    h: 600,
    nm: 'Test Animation',
    layers: [],
    assets: [],
  };

  const defaultProps = {
    lottieJson: mockLottie,
    defaultFilename: 'test-animation',
    validationMessage: 'Valid Lottie JSON',
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dialog with title', () => {
    render(<ExportDialog {...defaultProps} />);
    expect(screen.getByText('Export to Lottie JSON')).toBeInTheDocument();
  });

  it('should render filename input with default value', () => {
    render(<ExportDialog {...defaultProps} />);
    const input = screen.getByLabelText('Filename:') as HTMLInputElement;
    expect(input.value).toBe('test-animation');
  });

  it('should render JSON preview textarea', () => {
    render(<ExportDialog {...defaultProps} />);
    const textarea = screen.getByLabelText('JSON Preview:') as HTMLTextAreaElement;
    expect(textarea.value).toContain('"v": "5.5.7"');
    expect(textarea.value).toContain('"nm": "Test Animation"');
  });

  it('should allow updating filename', () => {
    render(<ExportDialog {...defaultProps} />);
    const input = screen.getByLabelText('Filename:') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'new-filename' } });
    expect(input.value).toBe('new-filename');
  });

  it('should render Download button', () => {
    render(<ExportDialog {...defaultProps} />);
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('should render Copy to Clipboard button', () => {
    render(<ExportDialog {...defaultProps} />);
    expect(screen.getByText('Copy to Clipboard')).toBeInTheDocument();
  });

  it('should close dialog when close button is clicked', () => {
    render(<ExportDialog {...defaultProps} />);
    const closeButton = screen.getByTitle('Close');
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should close dialog when overlay is clicked', () => {
    render(<ExportDialog {...defaultProps} />);
    const overlay = document.querySelector('.export-dialog-overlay');
    fireEvent.click(overlay!);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should not close dialog when dialog content is clicked', () => {
    render(<ExportDialog {...defaultProps} />);
    const dialog = document.querySelector('.export-dialog');
    fireEvent.click(dialog!);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('should show warning message when validation has warnings', () => {
    const props = {
      ...defaultProps,
      validationMessage: 'Valid, but with warnings:\nAnimation has no layers',
    };
    render(<ExportDialog {...props} />);
    expect(screen.getByText('Warning:')).toBeInTheDocument();
    expect(screen.getByText(/Animation has no layers/)).toBeInTheDocument();
  });

  it('should show error message when validation fails', () => {
    const props = {
      ...defaultProps,
      validationMessage: 'Validation failed:\nMissing required field: v',
    };
    render(<ExportDialog {...props} />);
    expect(screen.getByText('Error:')).toBeInTheDocument();
    expect(screen.getByText(/Missing required field/)).toBeInTheDocument();
  });

  it('should not show validation section for valid JSON', () => {
    render(<ExportDialog {...defaultProps} />);
    expect(screen.queryByText('Warning:')).not.toBeInTheDocument();
    expect(screen.queryByText('Error:')).not.toBeInTheDocument();
  });

  it('should copy JSON to clipboard when copy button is clicked', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(<ExportDialog {...defaultProps} />);
    const copyButton = screen.getByText('Copy to Clipboard');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('"v": "5.5.7"')
      );
    });

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText('✓ Copied!')).toBeInTheDocument();
    });
  });

  it('should trigger download when download button is clicked', () => {
    // Mock URL methods
    const createObjectURL = vi.fn(() => 'blob:test-url');
    const revokeObjectURL = vi.fn();
    const originalCreateObjectURL = global.URL.createObjectURL;
    const originalRevokeObjectURL = global.URL.revokeObjectURL;
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;

    // Render component first
    render(<ExportDialog {...defaultProps} />);

    // Now mock the link creation/click after render
    let capturedLink: any = null;
    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'a') {
        capturedLink = element;
        element.click = vi.fn(); // Mock click
      }
      return element;
    });

    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);

    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(capturedLink).toBeTruthy();
    expect(capturedLink.download).toBe('test-animation.json');
    expect(capturedLink.click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test-url');

    // Cleanup
    createElementSpy.mockRestore();
    global.URL.createObjectURL = originalCreateObjectURL;
    global.URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('should add .json extension if not present', () => {
    // Mock URL methods
    const createObjectURL = vi.fn(() => 'blob:test-url');
    const originalCreateObjectURL = global.URL.createObjectURL;
    global.URL.createObjectURL = createObjectURL;

    // Render component first
    render(<ExportDialog {...defaultProps} />);

    // Change filename to not have .json extension
    const input = screen.getByLabelText('Filename:') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'my-animation' } });

    // Now mock the link creation/click after render
    let capturedLink: any = null;
    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'a') {
        capturedLink = element;
        element.click = vi.fn(); // Mock click
      }
      return element;
    });

    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);

    expect(capturedLink).toBeTruthy();
    expect(capturedLink.download).toBe('my-animation.json');

    // Cleanup
    createElementSpy.mockRestore();
    global.URL.createObjectURL = originalCreateObjectURL;
  });
});
