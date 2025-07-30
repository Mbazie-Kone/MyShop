import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserId();
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private loadUserId(): void {
    this.userId = localStorage.getItem('user_id') || undefined;
  }

  setUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('user_id', userId);
  }

  trackEvent(category: string, action: string, label?: string, value?: number): void {
    const event: AnalyticsEvent = {
      event: 'interaction',
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    // Log to console in development
    if (this.isDevelopment()) {
      console.log('Analytics Event:', event);
    }

    // Send to analytics service (Google Analytics, etc.)
    this.sendToAnalytics(event);
  }

  trackFeatureUsage(feature: string): void {
    this.trackEvent('feature', 'used', feature);
  }

  trackFormInteraction(formName: string, action: string, field?: string): void {
    this.trackEvent('form', action, `${formName}${field ? '_' + field : ''}`);
  }

  trackError(error: string, context?: string): void {
    this.trackEvent('error', 'occurred', context || 'unknown', 1);
  }

  trackPerformance(metric: string, value: number): void {
    this.trackEvent('performance', metric, undefined, value);
  }

  trackUserJourney(step: string, page?: string): void {
    this.trackEvent('journey', step, page);
  }

  private sendToAnalytics(event: AnalyticsEvent): void {
    // Google Analytics 4
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameter_1: event.userId,
        custom_parameter_2: event.sessionId
      });
    }

    // Send to custom analytics endpoint
    this.sendToCustomEndpoint(event);
  }

  private sendToCustomEndpoint(event: AnalyticsEvent): void {
    // In a real application, you would send this to your analytics server
    // For now, we'll just store it locally for demonstration
    const events = this.getStoredEvents();
    events.push(event);
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('analytics_events', JSON.stringify(events));
  }

  private getStoredEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem('analytics_events');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  getAnalyticsData(): AnalyticsEvent[] {
    return this.getStoredEvents();
  }

  clearAnalyticsData(): void {
    localStorage.removeItem('analytics_events');
  }

  private isDevelopment(): boolean {
    return !environment.production;
  }
}

// Mock gtag function for development
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Initialize gtag if not available
if (typeof window !== 'undefined' && !window.gtag) {
  window.gtag = function(...args: any[]) {
    console.log('GTAG (Mock):', args);
  };
} 