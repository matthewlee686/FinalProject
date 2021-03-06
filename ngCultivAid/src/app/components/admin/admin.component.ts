import { stringify } from '@angular/compiler/src/util';
import { Exchange } from 'src/app/models/exchange';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Category } from 'src/app/models/category';
import { GardenItem } from 'src/app/models/garden-item';
import { Produce } from 'src/app/models/produce';
import { User } from 'src/app/models/user';
import { ExchangeService } from 'src/app/services/exchange.service';
import { CategoryService } from 'src/app/services/category.service';
import { GardenItemService } from 'src/app/services/garden-item.service';
import { ProduceService } from 'src/app/services/produce.service';
import { UpdateListingService } from 'src/app/services/update-listing.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { isTemplateHead } from 'typescript';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(
    private userSvc: UserService,
    private gardenItemSvc: GardenItemService,
    private updateGISvc: UpdateListingService,
    private produceSvc: ProduceService,
    private bsmodalService: BsModalService,
    private catSvc: CategoryService,
    private exchSvc: ExchangeService
    ) { }

  private baseUrl = environment.redirectUrl;

  allUsers: User[] = [];
  totalUsers: number | null = null;
  usersTraversed: number = 0;


  //Will list all Produce
  produces: Produce[] = [];
  categories: Category[] = [];
  newProduce: Produce = new Produce();
  findProducesForCreate: Produce[] = [];
  message: string = '';
  modalRef: BsModalRef | undefined;
  successfulAdd: Boolean = false;

  ngOnInit(): void {
    this.userSvc.getAllUsers().subscribe(
      list => {
        this.totalUsers = list.length;
        this.allUsers = list;
        this.buildUserList();
      },
      err => {
        console.log("Error getting all users");
      }
    );

    //Will index produce
    this.indexProduce();
    this.indexCategories();
  }

  changeActiveStatus(user: User) {
    user.active = !user.active;
    this.userSvc.editUser(user).subscribe(
      user => {
        let index = this.allUsers.indexOf(user);
        this.allUsers.splice(index, 1);
        this.allUsers.push(user);
      },
      err => {
        console.log("Error changing user active status")
      }
    );
  }

  changeItemActiveStatus(gardenItem: GardenItem) {
    gardenItem.active = !gardenItem.active;
    this.updateGISvc.update(gardenItem).subscribe(
      item => {
        this.allUsers = [];
        this.ngOnInit();
      },
      err => {
        console.log("Error changing garden item active status")
      }
    );
  }

  goToUserProfile(username: string){
    window.open(this.baseUrl + "#/publicProfile/" + username, "_blank");
  }

  buildUserList() {
    this.allUsers.forEach(user => {
      this.exchSvc.getSellerExchangesByUser(user).subscribe(
        exchanges => {
          console.log(exchanges);
          user.exchanges = [];
          exchanges.forEach(exchange => {
            user.exchanges.push(exchange);
          });
          this.usersTraversed += 1;
        },
        err => {
          console.error("Cannot get exchanges")
        }
      );
    });
    console.log(this.allUsers);
  }


  //This will index the Produces
  indexProduce() {
      //To index all produce
      this.produceSvc.index().subscribe(
        data => {
          this.produces = data;
        },
        fail => {
          console.log('Failed to retrieve list of Produce');
          console.log(fail);
        });
  }

  //To index all Categories for Produce Creation
  indexCategories() {
    this.catSvc.index().subscribe(
      data => {
        this.categories = data;
      },
      fail => {
        console.log('Failed to retrieve Categories');
        console.log(fail);
      });
  }

  //Will allow an Admin to create a new Produce that will
  //display in the 'create-listings' Form
  createProduce(produce:Produce) {
    this.produceSvc.create(produce).subscribe(
      data => {
        console.log('Produce added');
        this.indexProduce();
        this.successfulAdd = true;
      },
      fail => {
        console.log("Failed to add Produce");
        console.log(fail);
      }
    );
  }

  //For Modal use
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsmodalService.show(template, {class: 'modal-sm'});
  }

  decline() {
    this.message = 'Cancel Update Listing Request';
    this.newProduce= new Produce();
    this.bsmodalService.hide();
  }

}
