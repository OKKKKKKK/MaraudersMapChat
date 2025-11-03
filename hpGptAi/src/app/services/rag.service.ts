import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RagService {
  constructor() {}

  base = 'http://localhost:8000';

  async query(q: string) {
    const res = await fetch(this.base + '/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q }),
    });
    if (!res.ok) throw new Error('Server error ' + res.status);
    return res.json();
  }
}
