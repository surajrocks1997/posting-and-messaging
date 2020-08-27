import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Post } from '../posts/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number): void {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; totalPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }),
            totalPosts: postData.totalPosts,
          };
        })
      )
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: postData.totalPosts,
        });
      });
  }

  getPostUpdateListener(): Observable<{ posts: Post[]; postCount: number }> {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string): Observable<any> {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File): void {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: any): void {
    let postData: FormData | Post;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
      };
    }
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      'http://localhost:3000/api/posts/' + postId
    );
  }
}
