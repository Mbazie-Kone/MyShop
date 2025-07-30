import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  constructor(private sanitizer: DomSanitizer) {}

  sanitizeHtml(text: string): SafeHtml {
    if (!text) return '';
    
    // Remove dangerous HTML tags and attributes
    const cleanText = this.removeDangerousContent(text);
    return this.sanitizer.bypassSecurityTrustHtml(cleanText);
  }

  sanitizeUrl(url: string): SafeUrl {
    if (!url) return '';
    
    // Validate URL format
    if (this.isValidUrl(url)) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return '';
  }

  private removeDangerousContent(text: string): string {
    // Remove script tags and their content
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers
    text = text.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // Remove javascript: URLs
    text = text.replace(/javascript:/gi, '');
    
    // Remove data: URLs (potential XSS)
    text = text.replace(/data:/gi, '');
    
    // Remove vbscript: URLs
    text = text.replace(/vbscript:/gi, '');
    
    // Remove iframe tags
    text = text.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    
    // Remove object tags
    text = text.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
    
    // Remove embed tags
    text = text.replace(/<embed\b[^>]*>/gi, '');
    
    // Remove applet tags
    text = text.replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '');
    
    return text;
  }

  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  validateInput(input: string, maxLength = 1000): boolean {
    if (!input || input.length > maxLength) {
      return false;
    }
    
    // Check for potential XSS patterns
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /data:/i,
      /on\w+\s*=/i
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(input));
  }

  escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }
} 