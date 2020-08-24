import { Injectable } from '@angular/core';

import { Post } from '../posts/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];

  constructor() {}

  getPosts(): Post[] {
    return [...this.posts];
  }

  addPost(title: string, content: string): void {
    const post: Post = {
      title,
      content,
    };
    this.posts.push(post);
  }
}
