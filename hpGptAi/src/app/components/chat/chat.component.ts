import { Component, inject, OnInit, signal } from '@angular/core';
import { RagService } from '../../services/rag.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  meta?: any;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  ragService = inject(RagService); // if using dependency injection, adapt accordingly

  messages = signal<Message[]>([
    {
      id: 's1',
      role: 'system',
      text: 'Welcome to Hogwarts Chat — ask anything about the seven books or movies!',
    },
  ]);

  input = signal('');
  loading = signal(false);

  footsteps = Array.from({ length: 5 }).map(() => ({
  top: Math.random() * 400,
  left: Math.random() * 250,
}));

ngOnInit(): void {
  setInterval(() => {
  this.footsteps = Array.from({ length: 5 }).map(() => ({
    top: Math.random() * 400,
    left: Math.random() * 250,
  }));
}, 5000);
}

  send = async () => {
    const text = this.input();
    if (!text?.trim()) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text };
    this.messages.set([...this.messages(), userMsg]);
    this.input.set('');
    this.loading.set(true);

    try {
      const resp = await this.ragService.query(text);
      const assistant: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: resp.answer[0].content,
        meta: { sources: resp.answer[1].map((el: any) => el.metadata.source) },
      };
      this.messages.set([...this.messages(), assistant]);
      // optionally scroll to bottom
    } catch (err: any) {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: 'Error: ' + (err?.message ?? err),
      };
      this.messages.set([...this.messages(), errMsg]);
    } finally {
      this.loading.set(false);
    }
  };

  onKey(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  updateInput(value: string) {
  this.input.set(value);
  }

  



}
