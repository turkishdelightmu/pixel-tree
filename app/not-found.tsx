import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Pixel dead tree */}
      <svg
        width="64" height="80"
        viewBox="0 0 64 80"
        style={{ imageRendering: 'pixelated', width: 128, height: 160 }}
        aria-hidden="true"
      >
        {/* Trunk */}
        <rect x="29" y="36" width="5" height="40" fill="#3a2a1c" />
        <rect x="30" y="36" width="3" height="38" fill="#4a3828" />
        {/* Left branch */}
        <rect x="16" y="38" width="14" height="3" fill="#3a2a1c" />
        <rect x="10" y="30" width="8" height="2" fill="#3a2a1c" />
        <rect x="8"  y="26" width="5" height="2" fill="#3a2a1c" />
        {/* Right branch */}
        <rect x="34" y="32" width="14" height="3" fill="#3a2a1c" />
        <rect x="46" y="24" width="8" height="2" fill="#3a2a1c" />
        <rect x="48" y="20" width="5" height="2" fill="#3a2a1c" />
        {/* Center twigs */}
        <rect x="29" y="18" width="2" height="18" fill="#3a2a1c" />
        {/* Ground */}
        <rect x="18" y="74" width="28" height="3" fill="#1c2c3c" />
      </svg>

      <div className="font-pixel text-[9px] text-muted tracking-[3px] mb-4 mt-8">ERROR 404</div>
      <h1 className="font-pixel text-white mb-4" style={{ fontSize: 'clamp(14px, 2vw, 22px)' }}>
        PAGE NOT FOUND
      </h1>
      <p className="text-muted text-[14px] max-w-[360px] leading-[1.7] mb-8">
        This tree didn&apos;t grow here. The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="font-pixel text-[9px] bg-accent text-black px-6 py-3 no-underline hover:bg-[#00e88d] transition-colors"
      >
        PLANT A NEW TREE ▶
      </Link>
    </div>
  );
}
