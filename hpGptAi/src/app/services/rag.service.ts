import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RagService {
  constructor() {}

  base = window.location.hostname === 'localhost'
  ? 'http://localhost:8000'
  : 'https://maraudersmapchat.onrender.com';

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
