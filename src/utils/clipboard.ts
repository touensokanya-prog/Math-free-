/**
 * Utility function to copy text to clipboard with cross-browser fallback
 * and callback / promise support.
 */

export interface CopyResult {
  success: boolean;
  message: string;
}

export async function copyToClipboard(
  text: string,
  label: string = 'LaTeX/TikZ Code'
): Promise<CopyResult> {
  if (!text || text.trim() === '') {
    return {
      success: false,
      message: 'គ្មានកូដសម្រាប់ចម្លងទេ (No code to copy)',
    };
  }

  let success = false;

  // Try modern navigator.clipboard API first
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      success = true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, using fallback:', err);
    }
  }

  // Fallback for older browsers or restricted iframe contexts
  if (!success && typeof document !== 'undefined') {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      success = document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch (err2) {
      console.error('execCommand copy failed:', err2);
    }
  }

  if (success) {
    return {
      success: true,
      message: `បានចម្លង ${label} ដោយជោគជ័យ! (Copied to clipboard)`,
    };
  } else {
    return {
      success: false,
      message: 'មិនអាចចម្លងបានទេ សូមជ្រើសរើស និងចម្លងដោយដៃ (Failed to copy)',
    };
  }
}
