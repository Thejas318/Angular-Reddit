import { Component, OnInit } from '@angular/core';
import { PostService } from '../shared/post.service';
import { PostModel } from '../shared/post-model';
import { faCoffee, faComments, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  faComments = faComments;
  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;
  posts$: Array<PostModel> = [];

  constructor(private postService: PostService) {
    this.postService.getAllPost().subscribe(post => {
      this.posts$ = post;
    })
  }


  ngOnInit(): void {
    
  }

}
