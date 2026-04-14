interface ExportDownloadBarProps {
  onDownloadImage: () => void;
  onDownloadText: () => void;
  isExporting?: boolean;
  className?: string;
}

export function ExportDownloadBar({ onDownloadImage, onDownloadText, isExporting, className = "" }: ExportDownloadBarProps) {
  return (
    <div className={`flex flex-wrap gap-2 items-center ${className}`}>
      <span className="text-xs text-muted-foreground/60 mr-1">Tải về:</span>
      <button
        onClick={onDownloadImage}
        disabled={isExporting}
        className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 disabled:opacity-50 font-medium"
      >
        {isExporting ? (
          <>
            <span className="w-3 h-3 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            <span>Đang xuất...</span>
          </>
        ) : (
          <>
            <ImageIcon />
            <span>Hình ảnh PNG</span>
          </>
        )}
      </button>

      <button
        onClick={onDownloadText}
        className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium"
      >
        <FileTextIcon />
        <span>File văn bản</span>
      </button>
    </div>
  );
}

function ImageIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
