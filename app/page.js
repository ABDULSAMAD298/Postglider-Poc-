'use client';

import { useState, useEffect, useRef } from 'react';

// ─── Toast Component ───────────────────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '360px',
        width: '100%',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px 16px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12), 0 4px 10px -6px rgba(0,0,0,0.08)',
            animation: 'toastSlide 0.3s ease',
            borderLeft: `4px solid ${toast.type === 'success' ? '#22c55e' : toast.type === 'error' ? '#ef4444' : '#6366f1'}`,
          }}
        >
          <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>
              {toast.title}
            </p>
            {toast.message && (
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                {toast.message}
              </p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              fontSize: '16px',
              lineHeight: 1,
              padding: '2px',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner({ size = 20, color = '#6366f1' }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2px solid transparent`,
        borderTopColor: color,
        borderRightColor: color,
        animation: 'spin 0.7s linear infinite',
      }}
    />
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header
      style={{
        background: '#fff',
        borderBottom: '1px solid #e8edf5',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
            }}
          >
            <span style={{ fontSize: '16px' }}>✨</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              PostGlider
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#6366f1',
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '999px',
                padding: '2px 8px',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              Pixelixe POC
            </span>
          </div>
        </div>

        {/* Nav right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a
            href="https://designplatform.shop"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '13.5px',
              fontWeight: 500,
              color: '#475569',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#6366f1')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
          >
            ArtVerve
            <span style={{ fontSize: '12px' }}>↗</span>
          </a>
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 0 3px rgba(34,197,94,0.2)',
            }}
          />
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
            API Connected
          </span>
        </div>
      </div>
    </header>
  );
}

// ─── Constants ───────────────────────────────────────────────────────────────
const platformDocumentMap = {
  instagram: "d6a82abe0953e76ffcfea8cfa9c40c2e",
  linkedin: "1b39be428cba28d5b14e939811a4135f",
  facebook: "74f6d49e561388c834dbd1ec21a8752b"
};

const toBase64 = (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = () => {
    // Aggressively remove newlines, tabs and all whitespace
    const result = reader.result
      .replace(/[\r\n\t]/g, '')
      .replace(/\s+/g, '')
      .trim();
    resolve(result);
  };
  reader.readAsDataURL(file);
});

// ─── Editor Modal ─────────────────────────────────────────────────────────────
function EditorModal({ isOpen, onClose, platform }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.8)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Modal Container */}
      <div
        style={{
          position: 'relative',
          margin: '20px',
          borderRadius: '20px',
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          animation: 'scaleIn 0.25s ease',
          minWidth: '1000px',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid #e2e8f0',
            background: '#fafafa',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '13px' }}>✏️</span>
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                Pixelixe Image Editor
              </p>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1 }}>
                Edit and customize your branded image
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '17px',
              color: '#64748b',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee2e2';
              e.currentTarget.style.borderColor = '#fca5a5';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            ×
          </button>
        </div>

        {/* iFrame */}
        <iframe
          src={`https://studio.pixelixe.com/#api?apiKey=${process.env.NEXT_PUBLIC_PIXELIXE_KEY}&document_uid=${platformDocumentMap[platform] || platformDocumentMap.instagram}&overwrite=false`}
          style={{ flex: 1, border: 'none', display: 'block', minWidth: '1000px' }}
          title="Pixelixe Editor"
          allow="clipboard-read; clipboard-write"
          allowFullScreen
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}

// ─── Form Panel ───────────────────────────────────────────────────────────────
function FormPanel({ onGenerate, isGenerating, platform, setPlatform }) {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [brandLogo, setBrandLogo] = useState(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState(null);

  const platforms = [
    { value: 'instagram', label: '📸  Instagram', sub: '1080 × 1080' },
    { value: 'facebook', label: '👥  Facebook', sub: '1200 × 630' },
    { value: 'linkedin', label: '💼  LinkedIn', sub: '1200 × 627' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    let mainImageBase64 = null;
    let brandLogoBase64 = null;

    if (mainImage) {
      mainImageBase64 = await toBase64(mainImage);
    }

    if (brandLogo) {
      brandLogoBase64 = await toBase64(brandLogo);
    }

    onGenerate({
      mainTitle: title,
      captionText: caption,
      mainImageBase64,
      brandLogoBase64,
      platform
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: '#0f172a',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    lineHeight: 1.5,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
    letterSpacing: '0.01em',
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '20px',
        border: '1px solid #e8edf5',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f5f9',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.04) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
            }}
          >
            <span style={{ fontSize: '14px' }}>📝</span>
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              Content Details
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1 }}>
              Fill in your post information below
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Post Title */}
          <div>
            <label htmlFor="post-title" style={labelStyle}>
              Post Title
              <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>
            </label>
            <input
              id="post-title"
              type="text"
              placeholder="e.g. Summer Collection Launch 🌞"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Caption */}
          <div>
            <label htmlFor="caption-text" style={labelStyle}>
              Caption Text
              <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>
            </label>
            <textarea
              id="caption-text"
              placeholder="Write an engaging caption for your audience..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              rows={3}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: '88px',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Main Image Upload */}
          <div>
            <label htmlFor="main-image" style={labelStyle}>
              Main Image
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {mainImagePreview ? (
                  <img src={mainImagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '20px' }}>🖼️</span>
                )}
              </div>
              <input
                id="main-image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setMainImage(file);
                    setMainImagePreview(URL.createObjectURL(file));
                  }
                }}
                style={{ fontSize: '12px' }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>
              Upload a background image (jpg, png, webp)
            </p>
          </div>

          {/* Brand Logo Upload */}
          <div>
            <label htmlFor="brand-logo" style={labelStyle}>
              Brand Logo
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {brandLogoPreview ? (
                  <img src={brandLogoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                ) : (
                  <span style={{ fontSize: '20px' }}>🏷️</span>
                )}
              </div>
              <input
                id="brand-logo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setBrandLogo(file);
                    setBrandLogoPreview(URL.createObjectURL(file));
                  }
                }}
                style={{ fontSize: '12px' }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>
              Upload your brand logo
            </p>
          </div>

          {/* Platform */}
          <div>
            <label style={labelStyle}>Platform</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {platforms.map((p) => (
                <label
                  key={p.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: `1.5px solid ${platform === p.value ? '#6366f1' : '#e2e8f0'}`,
                    background: platform === p.value ? 'rgba(99,102,241,0.06)' : '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <input
                    type="radio"
                    name="platform"
                    value={p.value}
                    checked={platform === p.value}
                    onChange={() => setPlatform(p.value)}
                    style={{ accentColor: '#6366f1' }}
                  />
                  <span style={{ fontSize: '13.5px', fontWeight: 500, color: '#0f172a', flex: 1 }}>
                    {p.label}
                  </span>
                  <span
                    style={{
                      fontSize: '11.5px',
                      color: '#94a3b8',
                      fontFamily: 'monospace',
                      background: '#f1f5f9',
                      padding: '2px 7px',
                      borderRadius: '5px',
                    }}
                  >
                    {p.sub}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isGenerating}
            style={{
              width: '100%',
              padding: '13px 20px',
              fontSize: '14.5px',
              fontWeight: 700,
              fontFamily: 'inherit',
              color: '#fff',
              background: isGenerating
                ? '#a5b4fc'
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '9px',
              transition: 'all 0.2s',
              boxShadow: isGenerating ? 'none' : '0 4px 15px rgba(99,102,241,0.4)',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={(e) => {
              if (!isGenerating) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isGenerating ? 'none' : '0 4px 15px rgba(99,102,241,0.4)';
            }}
          >
            {isGenerating ? (
              <>
                <Spinner size={16} color="#fff" />
                Generating...
              </>
            ) : (
              <>
                <span>Generate Branded Image</span>
                <span>✨</span>
              </>
            )}
          </button>

          {/* Sub-text */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#94a3b8',
              lineHeight: 1.5,
            }}
          >
            🔒 5 free generations included with Pro plan
          </p>
        </div>
      </form>
    </div>
  );
}

// ─── Result Panel ─────────────────────────────────────────────────────────────
function ResultPanel({ state, imageUrl, error, onRegenerate, onEdit }) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `postglider-${Date.now()}.jpeg`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '20px',
        border: '1px solid #e8edf5',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '480px',
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f5f9',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.04) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
            }}
          >
            <span style={{ fontSize: '14px' }}>🖼️</span>
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              Generated Image
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1 }}>
              Your branded social media visual
            </p>
          </div>
        </div>
        {state === 'success' && (
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#22c55e',
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '999px',
              padding: '3px 10px',
            }}
          >
            ● Ready
          </span>
        )}
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column' }}>

        {/* IDLE STATE */}
        {state === 'idle' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #e2e8f0',
              borderRadius: '16px',
              padding: '48px 24px',
              gap: '16px',
              background: '#fafbfc',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              <span style={{ fontSize: '32px' }}>🎨</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#374151' }}>
                Your generated image will appear here
              </p>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
                Fill in the form and click Generate to create<br />
                a branded visual for your social media posts
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px',
              }}
            >
              {['Instagram', 'Facebook', 'LinkedIn'].map((p) => (
                <span
                  key={p}
                  style={{
                    fontSize: '11.5px',
                    color: '#6366f1',
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: '999px',
                    padding: '3px 10px',
                    fontWeight: 500,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {state === 'loading' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              padding: '48px 24px',
            }}
          >
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  border: '3px solid rgba(99,102,241,0.15)',
                  borderTopColor: '#6366f1',
                  borderRightColor: '#8b5cf6',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: '12px',
                  borderRadius: '50%',
                  border: '2px solid rgba(139,92,246,0.2)',
                  borderTopColor: '#8b5cf6',
                  animation: 'spin 0.7s linear infinite reverse',
                }}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                Generating your image...
              </p>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                Pixelixe is building your branded visual
              </p>
            </div>
            {/* Progress Steps */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                width: '100%',
                maxWidth: '260px',
              }}
            >
              {['Connecting to Pixelixe API', 'Applying your content', 'Rendering the design'].map(
                (step, i) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: i < 2 ? '#6366f1' : 'rgba(99,102,241,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {i < 2 ? (
                        <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>
                      ) : (
                        <Spinner size={10} color="#6366f1" />
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '12.5px',
                        color: i < 2 ? '#374151' : '#94a3b8',
                        fontWeight: i < 2 ? 500 : 400,
                      }}
                    >
                      {step}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {state === 'error' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              padding: '48px 24px',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '18px',
                background: 'rgba(239,68,68,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '32px' }}>⚠️</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                Generation Failed
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: '#64748b',
                  marginTop: '8px',
                  padding: '10px 16px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  maxWidth: '340px',
                }}
              >
                {error || 'Something went wrong. Please try again.'}
              </p>
            </div>
            <button
              onClick={onRegenerate}
              style={{
                padding: '9px 20px',
                fontSize: '13.5px',
                fontWeight: 600,
                fontFamily: 'inherit',
                color: '#ef4444',
                background: '#fff',
                border: '1.5px solid #fca5a5',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* SUCCESS STATE */}
        {state === 'success' && imageUrl && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              animation: 'fadeIn 0.4s ease',
            }}
          >
            {/* Image */}
            <div
              style={{
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                position: 'relative',
              }}
            >
              <img
                src={imageUrl}
                alt="Generated branded image"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* Download */}
              <button
                onClick={handleDownload}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 10px rgba(34,197,94,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(34,197,94,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(34,197,94,0.3)';
                }}
              >
                <span>⬇</span> Download Image
              </button>

              {/* Regenerate */}
              <button
                onClick={onRegenerate}
                style={{
                  padding: '10px 16px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  color: '#6366f1',
                  background: '#fff',
                  border: '1.5px solid #c7d2fe',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#eef2ff';
                  e.currentTarget.style.borderColor = '#a5b4fc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#c7d2fe';
                }}
              >
                ↻ Regenerate
              </button>

              {/* Edit */}
              <button
                onClick={onEdit}
                style={{
                  padding: '10px 16px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  color: '#8b5cf6',
                  background: '#fff',
                  border: '1.5px solid #ddd6fe',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f3ff';
                  e.currentTarget.style.borderColor = '#c4b5fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#ddd6fe';
                }}
              >
                ✏️ Edit Image
              </button>
            </div>

            {/* Meta Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
              }}
            >
              <span style={{ fontSize: '13px', color: '#22c55e' }}>✓</span>
              <p style={{ fontSize: '12.5px', color: '#64748b' }}>
                Image generated successfully via Pixelixe API
              </p>
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginLeft: 'auto',
                  fontSize: '12px',
                  color: '#6366f1',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Open ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [resultState, setResultState] = useState('idle'); // idle | loading | success | error
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState('instagram');
  const [toasts, setToasts] = useState([]);
  const lastFormData = useRef(null);

  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleGenerate = async (formData) => {
    lastFormData.current = formData;
    setResultState('loading');
    setGeneratedImageUrl(null);
    setErrorMessage(null);

    try {
      const cleanBase64 = (str) => {
        if (!str || str === 'default') return 'default';
        return str
          .replace(/[\r\n\t]/g, '')  // remove newlines/tabs
          .replace(/\s+/g, '')        // remove all whitespace
          .trim();
      };

      const cleanedMainImage = cleanBase64(formData.mainImageBase64);
      const cleanedBrandLogo = cleanBase64(formData.brandLogoBase64);

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainTitle: formData.mainTitle,
          captionText: formData.captionText,
          mainImageBase64: cleanedMainImage,
          brandLogoBase64: cleanedBrandLogo,
          platform: formData.platform
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate image.');
      }

      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        setResultState('success');
        addToast('success', 'Image Generated!', 'Your branded image is ready to download.');
      } else if (data.raw) {
        // API responded but with an unexpected structure — show raw for debug
        setGeneratedImageUrl(null);
        setErrorMessage(
          'Image generated but URL not found in response. Check console for details.'
        );
        setResultState('error');
        addToast('error', 'Unexpected Response', 'Check the browser console for details.');
      }
    } catch (err) {
      setErrorMessage(err.message);
      setResultState('error');
      addToast('error', 'Generation Failed', err.message);
    }
  };

  const handleRegenerate = () => {
    if (lastFormData.current) {
      handleGenerate(lastFormData.current);
    } else {
      setResultState('idle');
    }
  };

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <EditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} platform={currentPlatform} />

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        {/* Hero Strip */}
        <div
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
            padding: '32px 24px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 50%)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '999px',
                padding: '5px 14px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '14px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#4ade80',
                  flexShrink: 0,
                  boxShadow: '0 0 0 3px rgba(74,222,128,0.3)',
                }}
              />
              Powered by Pixelixe Automation API
            </div>
            <h1
              style={{
                fontSize: 'clamp(22px, 4vw, 32px)',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              Create Stunning Branded Visuals
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.8)',
                marginTop: '8px',
                maxWidth: '520px',
                margin: '10px auto 0',
              }}
            >
              Generate professional social media images instantly.
              Enter your content, pick a platform, and let Pixelixe do the rest.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
            padding: '32px 24px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)',
              gap: '24px',
              alignItems: 'start',
            }}
            className="main-grid"
          >
            <FormPanel
              onGenerate={handleGenerate}
              isGenerating={resultState === 'loading'}
              platform={currentPlatform}
              setPlatform={setCurrentPlatform}
            />
            <ResultPanel
              state={resultState}
              imageUrl={generatedImageUrl}
              error={errorMessage}
              onRegenerate={handleRegenerate}
              onEdit={() => setIsEditorOpen(true)}
            />
          </div>
        </main>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid #e8edf5',
            background: '#fff',
            padding: '20px 24px',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                Need advanced AI image generation?
              </span>
              <a
                href="https://designplatform.shop"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#6366f1',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#4f46e5')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6366f1')}
              >
                Try ArtVerve →
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
                PostGlider × Pixelixe Integration POC
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#6366f1',
                  background: 'rgba(99,102,241,0.07)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  borderRadius: '999px',
                  padding: '2px 8px',
                }}
              >
                v1.0 POC
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Responsive Grid */}
      <style>{`
        @media (max-width: 768px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
