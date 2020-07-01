import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Contact } from '../interfaces';
import { concatAll } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ContactService {

  public array: Contact[] = []

  constructor(private http: HttpClient) {}

  public get(): Observable<Contact[]> {
    return this.http.get<Contact[]>('/api/v1/contacts')
  }

  public create(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>('/api/v1/contacts', contact)
  }

  public patch(contact: Contact): Observable<Contact> {
    return this.http.patch<Contact>(`/api/v1/contacts/${contact.id}`, contact)
  }

  public delete(id:number): Observable<{}> {
    return this.http.delete(`api/v1/contacts/${id}`)
  }
}