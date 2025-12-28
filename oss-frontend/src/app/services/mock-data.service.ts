import { Injectable } from '@angular/core';

// Deprecated: mock-data.service.ts replaced by models.ts and ProductService.
// Keep a small runtime guard so accidental injection surfaces a clear error.

@Injectable({ providedIn: 'root' })
export class MockDataService {
  constructor() {
    console.warn('MockDataService is deprecated. Use ProductService and models.ts instead.');
  }
}