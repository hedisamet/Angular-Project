import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}
  getAllEvent(): Observable<Event[]> {
    return this.http.get<Event[]>('http://localhost:3000/evenements');
  }
  // Method to create a new event
  createEvent(eventData: {
    titre: string;
    datedebut: string;
    datefin: string;
    lieu: string;
  }): Observable<any> {
    return this.http.post<any>('http://localhost:3000/evenements', eventData);
  }

  getEventById(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/evenements/${id}`);
  }
}
