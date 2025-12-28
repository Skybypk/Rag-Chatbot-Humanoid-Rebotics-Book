export function updateFavicon(
  status: 'active' | 'completed' | 'failed' | 'error' | 'cancelled' | 'default'
) {
  try {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Force TypeScript to understand the type
    let link = (
      document.querySelector("link[rel='icon']") ||
      document.querySelector("link[rel='shortcut icon']")
    ) as HTMLLinkElement | null;

    if (!link) {
      console.log('Favicon link not found, creating a new one');
      link = document.createElement('link') as HTMLLinkElement;
      link.rel = 'icon';
      link.type = 'image/png';
      document.head.appendChild(link);
    }

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bgColor = '#007bff';
    if (status === 'completed') bgColor = '#28a745';
    if (status === 'failed' || status === 'error') bgColor = '#dc3545';
    if (status === 'cancelled') bgColor = '#6c757d';
    if (status === 'default') bgColor = '#6c757d';

    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(16, 16, 10, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = bgColor;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AI', 16, 16);

    // Now TypeScript allows this
    link.href = canvas.toDataURL('image/png');

    console.log('Updated favicon:', status);
  } catch (error) {
    console.error('Error updating favicon:', error);
  }
}
 