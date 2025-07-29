import { Injectable } from '@angular/core';

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

  /**
   * Track feature usage
   */
  trackFeatureUsage(feature: string, category: string = 'feature', action: string = 'used'): void {
    const event: AnalyticsEvent = {
      event: 'feature_used',
      category,
      action,
      label: feature,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.sendAnalytics(event);
  }

  /**
   * Track form interactions
   */
  trackFormInteraction(formName: string, action: string, field?: string): void {
    const event: AnalyticsEvent = {
      event: 'form_interaction',
      category: 'form',
      action,
      label: `${formName}${field ? `_${field}` : ''}`,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.sendAnalytics(event);
  }

  /**
   * Track page views
   */
  trackPageView(page: string): void {
    const event: AnalyticsEvent = {
      event: 'page_view',
      category: 'navigation',
      action: 'view',
      label: page,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.sendAnalytics(event);
  }

  /**
   * Track errors
   */
  trackError(error: string, context?: string): void {
    const event: AnalyticsEvent = {
      event: 'error',
      category: 'error',
      action: 'occurred',
      label: error,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.sendAnalytics(event);
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: string, value: number): void {
    const event: AnalyticsEvent = {
      event: 'performance',
      category: 'performance',
      action: 'measured',
      label: metric,
      value,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.sendAnalytics(event);
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('analytics_user_id', userId);
  }

  /**
   * Get analytics data for reporting
   */
  getAnalyticsData(): AnalyticsEvent[] {
    const data = localStorage.getItem('analytics_events');
    return data ? JSON.parse(data) : [];
  }

  /**
   * Clear analytics data
   */
  clearAnalyticsData(): void {
    localStorage.removeItem('analytics_events');
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Load user ID from storage
   */
  private loadUserId(): void {
    this.userId = localStorage.getItem('analytics_user_id') || undefined;
  }

  /**
   * Send analytics data
   */
  private sendAnalytics(event: AnalyticsEvent): void {
    // Store locally for now (in a real app, this would send to a server)
    this.storeEventLocally(event);
    
    // Log to console for development
    console.log('Analytics Event:', event);
    
    // In production, you would send to your analytics service
    // this.sendToAnalyticsService(event);
  }

  /**
   * Store event locally
   */
  private storeEventLocally(event: AnalyticsEvent): void {
    const events = this.getAnalyticsData();
    events.push(event);
    
    // Keep only last 1000 events to prevent storage bloat
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }
    
    localStorage.setItem('analytics_events', JSON.stringify(events));
  }

  /**
   * Send to external analytics service (placeholder for production)
   */
  private sendToAnalyticsService(event: AnalyticsEvent): void {
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //   gtag('event', event.action, {
    //     event_category: event.category,
    //     event_label: event.label,
    //     value: event.value
    //   });
    // }
    
    // Example: Custom API endpoint
    // this.http.post('/api/analytics', event).subscribe();
  }
} 