import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostModel } from './post-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  getAllPostsUrl = 'http://localhost:8080/api/posts/';

  constructor(private http: HttpClient) { 

  }

  getAllPost(): Observable<Array<PostModel>> {
    return this.http.get<Array<PostModel>>(this.getAllPostsUrl);
  }
}
