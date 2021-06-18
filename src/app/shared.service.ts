import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json',
    }
  )
};

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  readonly APIUrl = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) { }

  getTodoList(): Observable<any>{
    return this.http.get<any>(`${this.APIUrl}?userId=1`);
  }

  postTodo(todo:any):Observable<any>{
    return this.http.post(`${this.APIUrl}?userId=1`, todo, httpOptions);
  }

  updateTodo(todo:any, id:any):Observable<any>{
    return this.http.put(`${this.APIUrl}/${id}`, todo, httpOptions);
  }

  deleteTodo(todoId:any):Observable<any>{
    return this.http.delete(`${this.APIUrl}/${todoId}`);
  }

}
