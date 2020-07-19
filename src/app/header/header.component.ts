import { Component, OnInit, EventEmitter,Output} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private userSub: Subscription;
  isAuthenticated = false;

  
  constructor(private dataStorageService: DataStorageService,
              private authServicce: AuthService) { }
  
  //Header always stayup in our apps can subscribe subject based on user status !!user;
    ngOnInit() {
      this.userSub = this.authServicce.user.subscribe(user =>{
        //true when we have user and false when we don't have user
        this.isAuthenticated = !user ? false: true;
        console.log(!user)
        console.log(!!user)
      })
    }
  onSaveData() {
    this.dataStorageService.storeRecipes()
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe()
  }
  
  onLogout() {
    this.authServicce.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
  }
}
