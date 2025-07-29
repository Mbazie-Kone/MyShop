import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Make it impure to react to language changes
})
export class TranslatePipe implements PipeTransform {
  constructor(private i18nService: I18nService) {}

  transform(key: string, params?: { [key: string]: string | number }): string {
    if (params) {
      return this.i18nService.translateWithParams(key, params);
    }
    return this.i18nService.translate(key);
  }
} 