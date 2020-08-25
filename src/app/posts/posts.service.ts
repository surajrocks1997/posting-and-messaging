import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from '../posts/post.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts(): void {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((postData) => {
        this.posts = postData;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string): void {
    const post: Post = {
      id: null,
      title,
      content,
    };
    this.http
      .post<{ message: string; post: any }>(
        'http://localhost:3000/api/posts',
        post
      )
      .pipe(
        map((responseData) => {
          const { message, post } = responseData;
          return {
            message,
            post: {
              id: post._id,
              title: post.title,
              content: post.content,
            },
          };
        })
      )
      .subscribe((responseData) => {
        this.posts.push(responseData.post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string): void {
    this.http
      .delete<{ message: string }>('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
