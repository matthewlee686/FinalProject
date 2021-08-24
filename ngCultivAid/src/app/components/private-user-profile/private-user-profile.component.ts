import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Exchange } from 'src/app/models/exchange';
import { GardenItem } from 'src/app/models/garden-item';
import { User } from 'src/app/models/user';
import { CreateListingService } from 'src/app/services/create-listing.service';
import { ExchangeService } from 'src/app/services/exchange.service';
import { GardenItemService } from 'src/app/services/garden-item.service';
import { UserService } from 'src/app/services/user.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { resourceLimits } from 'worker_threads';
import { isConstructorDeclaration } from 'typescript';

@Component({
  selector: 'app-private-user-profile',
  templateUrl: './private-user-profile.component.html',
  styleUrls: ['./private-user-profile.component.css'],
})
export class PrivateUserProfileComponent implements OnInit {
  isBuyerCollapsed: boolean[] = [];
  isSellerCollapsed: boolean[] = [];
  isInProgressCollapsed: boolean[] = [];
  isReviewCollapsed: boolean[] = [];

  user: User = new User();
  editedUser: User = new User();

  buyerExchanges: Exchange[] = [];

  buyerExchangesLoaded: boolean = false;

  sellerExchanges: Exchange[] = [];

<<<<<<< HEAD
  items: GardenItem[] = [];
  userItems: GardenItem[] = [];
  listingToUpdate: GardenItem | null = null;
=======
  editing: boolean = false;
  editingPicture: boolean = false;

  closeResult = '';

  passwordChangeForm = {
    curPassword: '',
    newPassword: '',
    matchPassword: '',
  };
>>>>>>> 1e13cc83bd5f10d02690b0d1a84cfeb10c345aba

  constructor(
    private userService: UserService,
    private exchangeService: ExchangeService,
    private router: Router,
<<<<<<< HEAD
    private createListing: CreateListingService,
    private gardenItemSvc: GardenItemService
    ) { }
=======
    private modalService: NgbModal,
    private authSvc: AuthService
  ) {}
>>>>>>> 1e13cc83bd5f10d02690b0d1a84cfeb10c345aba

  ngOnInit(): void {
    this.userService.getLoggedInUser().subscribe(
      (user) => {
        this.user = user;
<<<<<<< HEAD
        console.log("Logged In User: " + this.user.username);
        console.log(user.gardenItems.length);

=======
        this.editedUser = Object.assign({}, user);
        this.editedUser.address = Object.assign({}, user.address);
        console.log('Logged In User: ' + this.user.username);
>>>>>>> 1e13cc83bd5f10d02690b0d1a84cfeb10c345aba
      },
      (fail) => {
        console.log('Invalid User ');
        this.router.navigateByUrl('notFound');
      }
    );

    this.exchangeService.getBuyerExchanges().subscribe(
      (exchanges) => {
        this.buyerExchanges = exchanges;
        console.log('in exchangeService init call private profile');
        for (let i = 0; i < exchanges.length; i++) {
          this.isBuyerCollapsed.push(true);
          this.isReviewCollapsed.push(true);
          this.buyerExchangesLoaded = true;
        }
      },
      (fail) => {
        console.log(
          'In Private Profile Init(): Could not get buyer exchanges '
        );
        this.router.navigateByUrl('notFound');
      }
    );

    this.exchangeService.getSellerExchanges().subscribe(
      (exchanges) => {
        this.sellerExchanges = exchanges;
        console.log('in exchangeService init call private profile');
        for (let i = 0; i < exchanges.length; i++) {
          this.isSellerCollapsed.push(true);
          this.isInProgressCollapsed.push(true);
        }
      },
      (fail) => {
        console.log(
          'In Private Profile Init(): Could not get seller exchanges '
        );
        this.router.navigateByUrl('notFound');
      }
<<<<<<< HEAD
    )

    this.indexGardenItems();
=======
    );
>>>>>>> 1e13cc83bd5f10d02690b0d1a84cfeb10c345aba
  }

  goToPublicProfile() {
    this.router.navigateByUrl('publicProfile');
  }

  acceptIncomingExchange(exchange: Exchange) {
    exchange.accepted = true;
    this.exchangeService.updateExchange(exchange).subscribe(
      (exchanges) => {
        //this.sellerExchanges = exchanges;
        //console.log("in exchangeService init call private profile");
      },
      (fail) => {
        console.log(
          'In Private Profile acceptIncomingExchange(): Could not update exchange '
        );
        this.router.navigateByUrl('notFound');
      }
    );
  }

  denyIncomingExchange(exchange: Exchange) {
    exchange.accepted = false;
    exchange.active = false;
    this.exchangeService.updateExchange(exchange).subscribe(
      (exchanges) => {
        //this.sellerExchanges = exchanges;
        //console.log("in exchangeService init call private profile");
      },
      (fail) => {
        console.log(
          'In Private Profile acceptIncomingExchange(): Could not update exchange '
        );
        this.router.navigateByUrl('notFound');
      }
    );
  }

  completeExchange(exchange: Exchange) {
    exchange.complete = true;
    this.exchangeService.updateExchange(exchange).subscribe(
      (exchanges) => {
        //this.sellerExchanges = exchanges;
        //console.log("in exchangeService init call private profile");
      },
      (fail) => {
        console.log(
          'In Private Profile acceptIncomingExchange(): Could not update exchange '
        );
        this.router.navigateByUrl('notFound');
      }
    );
  }

  getOutgoingExchangeStatus(exchange: Exchange): string {
    if (!exchange.accepted && !exchange.complete) {
      return 'pending';
    }
    if (!exchange.accepted && exchange.complete) {
      return 'denied';
    }
    if (exchange.accepted && !exchange.complete) {
      return 'accepted';
    }
    if (exchange.complete && exchange.accepted) {
      return 'complete';
    } else {
      return '';
    }
  }

  displayExchangeDetails(): string {
    return 'details details details';
  }


  deactivateExchange(exchange: Exchange){
    exchange.active = false;
    this.exchangeService.updateExchange(exchange).subscribe(
      exchanges => {
        //this.sellerExchanges = exchanges;
        //console.log("in exchangeService init call private profile");
      },
      fail => {
        console.log('In Private Profile acceptIncomingExchange(): Could not update exchange ');
        this.router.navigateByUrl('notFound');
      });
    }

  getUser(username: string) {
    this.userService.getUserByUsername(username).subscribe(
      (user) => {
        this.userService.reroute(user);
      },
      (fail) => {
        console.error(
          'publicUserProfileComponent: error getting user by username'
        );

      }
    );
  }

<<<<<<< HEAD
  indexGardenItems() {
    this.gardenItemSvc.index().subscribe(
      data => {

        this.items = data;
        console.log(this.items);

        for (let item of this.items) {
            if (item.user == this.user){
            this.userItems.push(item);
            console.log(this.userItems);

          }
        }
      },
      fail => {
        console.log("Failure retrieving list of Garden Items for this User");
        console.log(fail);
      });
  }

  updateListing(item : GardenItem) {


  }

=======
  saveEdit() {
    this.userService.editUser(this.editedUser).subscribe(
      (user) => {
        this.user = user;
        this.editedUser = Object.assign({}, user);
        this.editedUser.address = Object.assign({}, user.address);
      },
      (fail) => {
        console.error(fail);
        console.error(
          'privateUserProfileComponent: error updating user information'
        );
      }
    );
  }
  cancelEdit() {
    this.editedUser = Object.assign({}, this.user);
    this.editedUser.address = Object.assign({}, this.user.address);
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === 'Save click') {
            if (this.authSvc.getCredentials() === btoa(this.user.username + ':' + this.passwordChangeForm.curPassword)) {
              this.editedUser.password = this.passwordChangeForm.matchPassword;
              this.userService.resetPassword(this.editedUser).subscribe(
                (userResult) => {
                  this.authSvc.logout();
                  this.login(userResult.username, this.editedUser.password);
                },
                (err) => {
                  console.log(err);
                }
              );
            }
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  login(username: string, password: string) {
    this.authSvc.login(username, password).subscribe(
      (loggedInUser) => {
        this.router.navigateByUrl('/privateProfile');
      },
      (fail) => {
        console.error('LoginComponent.login(): login failed');
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
>>>>>>> 1e13cc83bd5f10d02690b0d1a84cfeb10c345aba
}
