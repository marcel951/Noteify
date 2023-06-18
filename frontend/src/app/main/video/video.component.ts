import { Component, OnInit } from '@angular/core';

@Component({
  template: '<youtube-player videoId="dQw4w9WgXcQ"></youtube-player>',
  selector: 'app-video'
})
export class VideoComponent implements OnInit {
  ngOnInit() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
}