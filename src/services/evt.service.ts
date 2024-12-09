import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evt } from '../models/evt';

@Injectable({
  providedIn: 'root'
})
export class EvtService {
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Evt[]> {
    return this.httpClient.get<Evt[]>('http://localhost:3000/Evenements');
  }

  saveData(e: Evt): Observable<void> {
    return this.httpClient.post<void>('http://localhost:3000/Evenements', e);
  }

  getEventById(id: string): Observable<Evt> {
    return this.httpClient.get<Evt>(`http://localhost:3000/Evenements/${id}`);
  }

  updateEvent(id: string, evt: Evt): Observable<void> {
    return this.httpClient.put<void>(`http://localhost:3000/Evenements/${id}`, evt);
  }

  deleteEvent(id: string): Observable<void> {
    return this.httpClient.delete<void>(`http://localhost:3000/Evenements/${id}`);
  }
}
