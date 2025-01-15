import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { evt } from '../modeles/Event';

@Injectable({
  providedIn: 'root'
})
export class evtService {
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<evt[]> {
    return this.httpClient.get<evt[]>('http://localhost:3000/Evenements');
  }

  saveData(e: evt): Observable<void> {
    return this.httpClient.post<void>('http://localhost:3000/Evenements', e);
  }

  getEventById(id: string): Observable<evt> {
    return this.httpClient.get<evt>(`http://localhost:3000/Evenements/${id}`);
  }

  updateEvent(id: string, evt: evt): Observable<void> {
    return this.httpClient.put<void>(`http://localhost:3000/Evenements/${id}`, evt);
  }

  deleteEvent(id: string): Observable<void> {
    return this.httpClient.delete<void>(`http://localhost:3000/Evenements/${id}`);
  }
}
