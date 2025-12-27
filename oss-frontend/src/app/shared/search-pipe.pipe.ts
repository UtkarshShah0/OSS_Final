import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], query: string) {
    if (!items || !query) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}
