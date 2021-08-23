import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExchangeItem } from 'src/app/models/exchange-item';
import { User } from 'src/app/models/user';
import { ExchangeService } from 'src/app/services/exchange.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-public-user-profile',
  templateUrl: './public-user-profile.component.html',
  styleUrls: ['./public-user-profile.component.css'],
})
export class PublicUserProfileComponent implements OnInit {
  user: User = new User();

  exchangeItems: ExchangeItem[] = []; //request body
  exchangeItem = new ExchangeItem();
  exchangeData: any[] = [];

  isCollapsed: boolean = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private currentRoute: ActivatedRoute,
    private exchangeSvc: ExchangeService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.user;
    this.user.gardenItems.forEach((item) => {
      let exchangeObject = Object();
      exchangeObject['itemId'] = item.id;
      exchangeObject['amount'] = 0;
      exchangeObject['checked'] = false;
      this.exchangeData.push(exchangeObject);
    });
  }

  submitExchangeRequest() {
    console.log(this.exchangeData);
    this.exchangeData.forEach(dataRow => {
      if (dataRow.checked) {
        this.exchangeItem.gardenItem.id = dataRow.itemId;
        this.exchangeItem.quantity = dataRow.amount;
        this.exchangeItems.push(this.exchangeItem);
        this.exchangeItem = new ExchangeItem();
      }
    });
    this.exchangeSvc.createExchange(this.exchangeItems).subscribe(
      exchange => {
        console.log('succesfully created exchange and items');
        this.exchangeItems = [];
        this.exchangeItem = new ExchangeItem();
      },
      error => {
        console.log('failed to create exchange and exchange items');
      }
    );
  }



}
