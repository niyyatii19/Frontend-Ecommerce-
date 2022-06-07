import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Country } from 'src/app/commons/country';
import { OrderItems } from 'src/app/commons/order-item';
import { Order } from 'src/app/commons/orders';
import { PaymentInfo } from 'src/app/commons/payment-info';
import { Purchase } from 'src/app/commons/purchase';
import { State } from 'src/app/commons/state';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { MonthYearFormService } from 'src/app/services/month-year-form.service';
import { FormCustomValidators } from 'src/app/validators/form-custom-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0;
  currentMonths: number[] = [];
  currentYears: number[] = [];
  countries: Country[] = [];
  storage: Storage = sessionStorage;

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  orderTrackingNumber: string;

  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = '';
  isDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private monthService: MonthYearFormService,
    private cartService: CartServiceService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    this.setupStripePaymentForm();
    const email: string = JSON.parse(this.storage.getItem('userEmail'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl("", [Validators.required, Validators.minLength(2), FormCustomValidators.noWhiteSpace]),
        lastName: new FormControl("", [Validators.required, Validators.minLength(2), FormCustomValidators.noWhiteSpace]),
        email: new FormControl(email,
          [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl("", [Validators.required, Validators.minLength(2), FormCustomValidators.noWhiteSpace]),
        country: new FormControl("", [Validators.required]),
        state: new FormControl("", [Validators.required]),
        city: new FormControl("", [Validators.required, Validators.minLength(2), FormCustomValidators.noWhiteSpace]),
        zipcode: new FormControl("", [Validators.required, Validators.minLength(2), FormCustomValidators.noWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl("", [Validators.required, Validators.minLength(2), FormCustomValidators.noWhiteSpace]),
        country: new FormControl("", [Validators.required]),
        state: new FormControl("", [Validators.required]),
        city: new FormControl("", [Validators.required, Validators.minLength(2), FormCustomValidators.noWhiteSpace]),
        zipcode: new FormControl("", [Validators.required, Validators.minLength(2), FormCustomValidators.noWhiteSpace])
      }),
      creditCardDetails: this.formBuilder.group({
        // cardType: new FormControl("", [Validators.required]),
        // nameOnCard: new FormControl("", [Validators.required, Validators.minLength(2), FormCustomValidators.noWhiteSpace]),
        // cardNumber: new FormControl("", [Validators.required, Validators.pattern('[0-9]{16}')]),
        // securityCode: new FormControl("", [Validators.required, Validators.pattern('[0-9]{3}')]),
        // expirationMonth: new FormControl("", [Validators.required]),
        // expirationYear: new FormControl("", [Validators.required]),

      })
    });

    // this.monthService.getCrditCardYear().subscribe(
    //   data => this.currentYears = data
    // );

    // const startMonth: number = new Date().getMonth() + 1;
    // this.monthService.gettingCreditCardMonths(startMonth).subscribe(
    //   (data) => this.currentMonths = data
    // );


    this.monthService.gettingCountries().subscribe(
      data => this.countries = data
    );

    this.reviewCartDetails();
  }

  setupStripePaymentForm() {
    var elements = this.stripe.elements();

    this.cardElement = elements.create('card', { hidePostalCode: true });
    this.cardElement.mount("#card-element");
    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError = "";
      } else if (event.error) {
        this.displayError = event.error.message;
      }
    })
  }

  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      (data) => this.totalPrice = data
    );

    this.cartService.quantity.subscribe(
      (data) => this.totalQuantity = data
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipcode() { return this.checkoutFormGroup.get('shippingAddress.zipcode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipcode() { return this.checkoutFormGroup.get('billingAddress.zipcode'); }

  get cardType() { return this.checkoutFormGroup.get('creditCardDetails.cardType'); }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCardDetails.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('creditCardDetails.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('creditCardDetails.securityCode'); }
  get expirationMonth() { return this.checkoutFormGroup.get('creditCardDetails.expirationMonth'); }
  get expirationYear() { return this.checkoutFormGroup.get('creditCardDetails.expirationYear'); }




  copyAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;


    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
    }
  }


  handleMonthYear() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCardDetails');

    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
    const currentYear: number = new Date().getFullYear();
    let startMonth: number
    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;

    } else {
      startMonth = 1;
    }
    this.monthService.gettingCreditCardMonths(startMonth).subscribe(
      (data) => this.currentMonths = data
    );


  }

  getStates(formGroupName: string) {
    const formName = this.checkoutFormGroup.get(formGroupName);
    const code = formName.value.country.code;
    const name = formName.value.country.name;

    console.log(`${formGroupName} code: ${code}`);
    console.log(`${formGroupName} code: ${name}`);

    this.monthService.getStates(code).subscribe(
      (data) => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
      }

    );

  }



  onSubmit() {

    let order: Order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItems[] = cartItems.map(tempCartItemt => new OrderItems(tempCartItemt));

    let purchase: Purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingAddressCountry = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    const shippingAddressState = JSON.parse(JSON.stringify(purchase.shippingAddress.state));

    purchase.shippingAddress.country = shippingAddressCountry.name;
    purchase.shippingAddress.state = shippingAddressState.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingAddressCountry = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    const billingAddressState = JSON.parse(JSON.stringify(purchase.billingAddress.state));

    purchase.billingAddress.country = billingAddressCountry.name;
    purchase.billingAddress.state = billingAddressState.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.emailInfo = purchase.customer.email;
    if (!this.checkoutFormGroup.invalid) {
      this.isDisabled = true;
      console.log(this.paymentInfo.amount);
      console.log(this.totalPrice);
      this.checkoutService.paymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                 
                // email: purchase.customer.email,
                // name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                // address: {
                //   line1: purchase.billingAddress.street,
                //   city: purchase.billingAddress.city,
                //   state: purchase.billingAddress.state,
                //   postal_code: purchase.billingAddress.zipCode,
                //   Country: this.billingAddressCountry.value.code
                // }

              },

            }, { handleActions: false })
            .then(function (result) {
              if (result.error) {
                // inform the customer there was an error
                console.log(result.error.message)
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                // call REST API via the CheckoutService
                console.log(result)
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: response => {
                    console.log(response)
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
                    this.isDisabled = false;
                    // reset cart
                    this.resetCart();
                  },
                  error: err => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  }
                })
              }
            }.bind(this));
        }
      );
    } else {
      console.log("Hello error")
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }


  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.quantity.next(0);
    this.checkoutFormGroup.reset();
    this.cartService.persistCartitems();
    this.router.navigateByUrl("/products");
  }

}
