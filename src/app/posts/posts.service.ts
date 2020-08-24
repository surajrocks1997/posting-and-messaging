import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Post } from '../posts/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor() {}

  getPosts(): Post[] {
    return [...this.posts];
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string): void {
    const post: Post = {
      title,
      content,
    };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
