import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {
  
  mobileQuery: MediaQueryList; //variable para definir diseño responsivo

  menuNav= [
    {name: "Home", route: "home", icon: "home"},
    {name: "Categories", route: "category", icon: "category"},
    {name: "Products", route: "product", icon: "production_quantity_limits"}
  ]
  
  constructor(media: MediaMatcher){
    this.mobileQuery = media.matchMedia('(media-width 600px)');
  }

  shouldRun= true;

  ngOnInit(): void {
    
  }
}
