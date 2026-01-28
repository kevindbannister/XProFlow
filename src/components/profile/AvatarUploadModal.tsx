import type { DragEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { classNames } from '../../lib/utils';

type AvatarUploadModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (avatarUrl: string) => void;
};

const CROP_SIZE = 240;
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const readFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });

export const AvatarUploadModal = ({ open, onClose, onSave }: AvatarUploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.4);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setImageSrc(null);
      setZoom(1.4);
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
      setDragActive(false);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG or JPG).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Image size must be 5MB or less.');
      return;
    }
    setError(null);
    const dataUrl = await readFile(file);
    setImageSrc(dataUrl);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items?.length) return;
      const imageItem = Array.from(items).find((item) => item.type.startsWith('image/'));
      const file = imageItem?.getAsFile();
      if (!file) return;
      event.preventDefault();
      handleFile(file);
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handleFile, open]);

  const handleDrop = useCallback(
    async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragActive(false);
      const file = event.dataTransfer.files[0];
      if (file) {
        await handleFile(file);
      }
    },
    [handleFile]
  );

  const handleSave = useCallback(async () => {
    if (!imageSrc) return;
    const image = await loadImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.translate(CROP_SIZE / 2 + position.x, CROP_SIZE / 2 + position.y);
    ctx.scale(zoom, zoom);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
    onSave(canvas.toDataURL('image/png'));
    onClose();
  }, [imageSrc, onClose, onSave, position.x, position.y, zoom]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Change photo
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Upload a new avatar and adjust the crop.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-transparent px-3 py-1 text-sm text-slate-500 transition hover:border-gray-200 hover:text-slate-700 dark:hover:border-slate-800 dark:hover:text-slate-200"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div
              className={classNames(
                'flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center transition dark:border-slate-800 dark:bg-slate-900/40',
                dragActive && 'border-blue-300 bg-blue-50/60 dark:border-blue-500/70'
              )}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Drag & drop a photo here
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                PNG, JPG up to 5MB. You can also paste a screenshot.
              </p>
              {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    handleFile(file);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div
                className="relative flex h-[240px] w-[240px] items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-slate-900/60 dark:border-slate-800"
                onPointerDown={(event) => {
                  if (!imageSrc) return;
                  setIsDragging(true);
                  setDragStart({ x: event.clientX - position.x, y: event.clientY - position.y });
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  if (!isDragging) return;
                  setPosition({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y });
                }}
                onPointerUp={(event) => {
                  setIsDragging(false);
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }}
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="Avatar preview"
                    className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
                    style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
                    draggable={false}
                  />
                ) : (
                  <span className="text-sm text-white/70">Circular preview</span>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="zoom"
                className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
                Zoom
              </label>
              <input
                id="zoom"
                type="range"
                min={ZOOM_MIN}
                max={ZOOM_MAX}
                step={0.05}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="mt-2 w-full"
                disabled={!imageSrc}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag the image to reposition inside the circular frame.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={!imageSrc}>
            Save photo
          </Button>
        </div>
      </div>
    </div>
  );
};
