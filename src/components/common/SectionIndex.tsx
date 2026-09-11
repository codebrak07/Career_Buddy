import React from 'react';

interface SectionIndexProps {
  index: string; // "01", "02", etc.
  label: string;
  sublabel?: string;
  accentColor?: string;
  className?: string;
}

/**
 * Editorial section index — crisp, high-contrast, professional technical header.
 * Eliminates low-opacity watermarks and repetitive labels.
 */
export const SectionIndex: React.FC<SectionIndexProps> = ({
  index,
  label,
  sublabel,
  accentColor = '#FF4F00',
  className = '',
}) => {
  return (
    <div className={`section-header-block ${className}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="inline-flex items-center justify-center px-2 py-0.5 rounded font-mono text-[11px] font-bold tracking-wider"
          style={{
            backgroundColor: `${accentColor}14`,
            color: accentColor,
            border: `1px solid ${accentColor}33`,
          }}
        >
          {index}
        </span>
        <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#71717A]">
          SYSTEM SECTION
        </span>
      </div>
      <h2
        className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181B]"
        style={{
          fontFamily: 'var(--font-editorial, inherit)',
          letterSpacing: '-0.02em',
        }}
      >
        {label}
      </h2>
      {sublabel && (
        <p className="mt-1 text-xs sm:text-sm text-[#52525B] max-w-2xl leading-relaxed">
          {sublabel}
        </p>
      )}
    </div>
  );
};
