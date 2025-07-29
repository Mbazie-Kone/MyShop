import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl, SafeStyle } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  sanitizeHtml(html: string): SafeHtml {
    if (!html) return '';
    
    // Remove dangerous tags and attributes
    const cleanHtml = this.removeDangerousContent(html);
    
    return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
  }

  /**
   * Sanitize URL to prevent XSS attacks
   */
  sanitizeUrl(url: string): SafeUrl {
    if (!url) return '';
    
    // Check if URL is safe
    if (this.isSafeUrl(url)) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    
    return '';
  }

  /**
   * Sanitize CSS to prevent XSS attacks
   */
  sanitizeStyle(style: string): SafeStyle {
    if (!style) return '';
    
    // Remove dangerous CSS
    const cleanStyle = this.removeDangerousCSS(style);
    
    return this.sanitizer.bypassSecurityTrustStyle(cleanStyle);
  }

  /**
   * Validate and sanitize file upload
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size exceeds 5MB limit' };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type. Only JPG, PNG, and GIF are allowed' };
    }

    // Check file name for dangerous characters
    const dangerousChars = /[<>:"/\\|?*]/;
    if (dangerousChars.test(file.name)) {
      return { isValid: false, error: 'File name contains invalid characters' };
    }

    return { isValid: true };
  }

  /**
   * Validate input for SQL injection prevention
   */
  validateInput(input: string): { isValid: boolean; error?: string } {
    if (!input) return { isValid: true };

    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
      /(\b(OR|AND)\b\s+['"]\w+['"]\s*=\s*['"]\w+['"])/i,
      /(--|\/\*|\*\/|;)/,
      /(\b(WAITFOR|DELAY)\b)/i
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        return { isValid: false, error: 'Input contains potentially dangerous content' };
      }
    }

    return { isValid: true };
  }

  /**
   * Generate secure random string
   */
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Hash sensitive data (simple implementation - use proper hashing in production)
   */
  hashData(data: string): string {
    // This is a simple hash function - in production, use proper cryptographic hashing
    let hash = 0;
    if (data.length === 0) return hash.toString();
    
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Remove dangerous HTML content
   */
  private removeDangerousContent(html: string): string {
    // Remove script tags and their content
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers
    html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // Remove javascript: URLs
    html = html.replace(/javascript:/gi, '');
    
    // Remove data: URLs (potential for XSS)
    html = html.replace(/data:/gi, '');
    
    // Remove vbscript: URLs
    html = html.replace(/vbscript:/gi, '');
    
    // Remove iframe tags
    html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    
    // Remove object tags
    html = html.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
    
    // Remove embed tags
    html = html.replace(/<embed\b[^>]*>/gi, '');
    
    // Remove applet tags
    html = html.replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '');
    
    // Remove form tags
    html = html.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');
    
    // Remove input tags
    html = html.replace(/<input\b[^>]*>/gi, '');
    
    // Remove button tags
    html = html.replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, '');
    
    // Remove link tags with dangerous rel attributes
    html = html.replace(/<link[^>]*rel\s*=\s*["'](import|prefetch|preload)["'][^>]*>/gi, '');
    
    // Remove meta tags with dangerous content
    html = html.replace(/<meta[^>]*http-equiv\s*=\s*["']refresh["'][^>]*>/gi, '');
    
    return html;
  }

  /**
   * Remove dangerous CSS
   */
  private removeDangerousCSS(css: string): string {
    // Remove expression() function
    css = css.replace(/expression\s*\([^)]*\)/gi, '');
    
    // Remove url() with javascript: or data:
    css = css.replace(/url\s*\(\s*["']?(javascript:|data:)[^)]*["']?\s*\)/gi, '');
    
    // Remove import statements
    css = css.replace(/@import[^;]*;/gi, '');
    
    // Remove @charset statements
    css = css.replace(/@charset[^;]*;/gi, '');
    
    return css;
  }

  /**
   * Check if URL is safe
   */
  private isSafeUrl(url: string): boolean {
    // Allow relative URLs
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return true;
    }
    
    // Allow http and https URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return true;
    }
    
    // Allow mailto and tel URLs
    if (url.startsWith('mailto:') || url.startsWith('tel:')) {
      return true;
    }
    
    return false;
  }

  /**
   * Escape HTML entities
   */
  escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Unescape HTML entities
   */
  unescapeHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  }
} 