import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getUrl()
        .then(result => console.log(result))
        .catch(error => console.log(error));
  }

}
