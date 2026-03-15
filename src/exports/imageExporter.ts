/**
 * Image Exporter
 * Captures the current canvas frame as PNG and triggers download.
 */

/**
 * Export the current canvas content as a PNG file.
 */
export function exportCanvasAsPNG(canvas: HTMLCanvasElement, filename?: string): void {
  const name = filename ?? `shader-pattern-${Date.now()}.png`;

  canvas.toBlob((blob) => {
    if (!blob) {
      console.error('[ImageExporter] Failed to create blob from canvas');
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Export the full appreciation card as a PNG.
 * Combines the shader preview with user details on a custom canvas.
 */
export function exportFullCardAsPNG(
  shaderCanvas: HTMLCanvasElement,
  name: string,
  role: string,
  bio: string,
  bgColor: string,
  nameColor: string,
  roleColor: string,
  bioColor: string,
  filename: string
): void {
  const cardWidth = 440 * 2; // High DPI (880px)
  const cardHeight = 600 * 2; // (1200px)
  const borderRadius = 32 * 2;
  
  const canvas = document.createElement('canvas');
  canvas.width = cardWidth;
  canvas.height = cardHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Function to create a rounded rectangle path
  const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // 1. Clip and Draw Background
  ctx.save();
  roundRect(0, 0, cardWidth, cardHeight, borderRadius);
  ctx.clip();
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, cardWidth, cardHeight);

  // 2. Draw Shader Preview (Top portion)
  const previewHeight = 350 * 2;
  ctx.drawImage(shaderCanvas, 0, 0, cardWidth, previewHeight);

  // 3. Draw Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, previewHeight);
  ctx.lineTo(cardWidth, previewHeight);
  ctx.stroke();

  // 4. Draw Text Content
  ctx.textBaseline = 'top';
  const hPadding = 24 * 2; // Match CSS 24px
  const vPadding = 32 * 2; // Match CSS 32px (padding-top)
  const maxWidth = cardWidth - (hPadding * 2);
  let currentY = previewHeight + vPadding;
  
  // Name (Inter Bold) - Matching 2.4rem -> ~76px @ 2x
  let nameSize = 76;
  ctx.fillStyle = nameColor;
  ctx.font = `800 ${nameSize}px Inter, sans-serif`;
  
  // Auto-shrink name if too long
  while (ctx.measureText(name).width > maxWidth && nameSize > 40) {
    nameSize -= 2;
    ctx.font = `800 ${nameSize}px Inter, sans-serif`;
  }
  
  ctx.fillText(name, hPadding, currentY);
  currentY += nameSize + 24; // Match CSS gap: 12px (24px @ 2x)

  // Role - Matching 1.1rem -> ~35px @ 2x
  const roleSize = 35;
  ctx.fillStyle = roleColor;
  ctx.font = `600 ${roleSize}px Inter, sans-serif`;
  ctx.fillText(role, hPadding, currentY);
  currentY += roleSize + 40; // Match CSS gap: 12px + bio margin-top: 8px (40px @ 2x)

  // Bio Description (Wrapping) - Matching 0.95rem -> ~31px @ 2x
  ctx.fillStyle = bioColor;
  ctx.font = '400 31px Inter, sans-serif';
  const words = bio.split(' ');
  let line = '';
  const lineHeight = 50; // Match 1.6 line-height

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, hPadding, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, hPadding, currentY);
  
  ctx.restore();

  // 5. Trigger download
  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
}
