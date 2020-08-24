import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredValue = '';
  newPost = 'No Content';

  constructor() {}

  ngOnInit(): void {}

  onAddPost(): void {
    this.newPost = this.enteredValue;
  }
}
