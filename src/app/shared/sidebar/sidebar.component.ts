import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  choosePayPageId: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private message: MessageService) { }

  paymentOptions: any = [
    {
      'heading': 'Essentials',
      'items': [
        // {
        //   "id": "0",
        //   "name": "Dashboard",
        //   "url": "/dashboard",
        //   "icon": "home"
        // },
        {
          "id": "1",
          "name": "Vendor",
          "url": "/pay/vendors",
          "icon": "M15.6094 7.8125C15.6094 7.92439 15.5649 8.03169 15.4858 8.11081C15.4067 8.18993 15.2994 8.23437 15.1875 8.23437C15.0756 8.23437 14.9683 8.18993 14.8892 8.11081C14.8101 8.03169 14.7656 7.92439 14.7656 7.8125V4.33133L9.86133 9.23562C9.78135 9.31014 9.67558 9.35071 9.56628 9.34879C9.45699 9.34686 9.35271 9.30258 9.27541 9.22529C9.19812 9.14799 9.15384 9.04371 9.15192 8.93442C9.14999 8.82512 9.19056 8.71935 9.26508 8.63937L14.1687 3.73437H10.6875C10.5756 3.73437 10.4683 3.68993 10.3892 3.61081C10.3101 3.53169 10.2656 3.42439 10.2656 3.3125C10.2656 3.20061 10.3101 3.09331 10.3892 3.01419C10.4683 2.93507 10.5756 2.89063 10.6875 2.89062H15.1875C15.2994 2.89063 15.4067 2.93507 15.4858 3.01419C15.5649 3.09331 15.6094 3.20061 15.6094 3.3125V7.8125ZM12.9375 9.64062C12.8256 9.64062 12.7183 9.68507 12.6392 9.76419C12.5601 9.84331 12.5156 9.95061 12.5156 10.0625V15.125C12.5156 15.1623 12.5008 15.1981 12.4744 15.2244C12.4481 15.2508 12.4123 15.2656 12.375 15.2656H3.375C3.3377 15.2656 3.30194 15.2508 3.27556 15.2244C3.24919 15.1981 3.23437 15.1623 3.23437 15.125V6.125C3.23437 6.0877 3.24919 6.05193 3.27556 6.02556C3.30194 5.99919 3.3377 5.98437 3.375 5.98437H8.4375C8.54939 5.98437 8.65669 5.93993 8.73581 5.86081C8.81493 5.78169 8.85937 5.67439 8.85937 5.5625C8.85937 5.45061 8.81493 5.34331 8.73581 5.26419C8.65669 5.18507 8.54939 5.14062 8.4375 5.14062H3.375C3.11393 5.14062 2.86355 5.24434 2.67894 5.42894C2.49434 5.61355 2.39062 5.86393 2.39062 6.125V15.125C2.39062 15.3861 2.49434 15.6365 2.67894 15.8211C2.86355 16.0057 3.11393 16.1094 3.375 16.1094H12.375C12.6361 16.1094 12.8865 16.0057 13.0711 15.8211C13.2557 15.6365 13.3594 15.3861 13.3594 15.125V10.0625C13.3594 9.95061 13.3149 9.84331 13.2358 9.76419C13.1567 9.68507 13.0494 9.64062 12.9375 9.64062Z" ,
          "fill" : "black"
        },
        {
          "id": "2",
          "name": "Customer",
          "url": "/collect/customers",
          "icon": "M8.85959 9.5625V14.0625C8.85959 14.1744 8.81515 14.2817 8.73603 14.3608C8.65691 14.4399 8.54961 14.4844 8.43772 14.4844C8.32583 14.4844 8.21853 14.4399 8.13941 14.3608C8.06029 14.2817 8.01584 14.1744 8.01584 14.0625V10.5813L3.11084 15.4856C3.03087 15.5601 2.92509 15.6007 2.8158 15.5988C2.70651 15.5969 2.60223 15.5526 2.52493 15.4753C2.44764 15.398 2.40336 15.2937 2.40143 15.1844C2.3995 15.0751 2.44007 14.9693 2.51459 14.8894L7.41889 9.98438H3.93772C3.82583 9.98438 3.71852 9.93993 3.63941 9.86081C3.56029 9.78169 3.51584 9.67439 3.51584 9.5625C3.51584 9.45061 3.56029 9.34331 3.63941 9.26419C3.71852 9.18507 3.82583 9.14062 3.93772 9.14062H8.43772C8.54961 9.14062 8.65691 9.18507 8.73603 9.26419C8.81515 9.34331 8.85959 9.45061 8.85959 9.5625ZM14.6252 2.39062H5.62522C5.36415 2.39062 5.11377 2.49434 4.92916 2.67894C4.74455 2.86355 4.64084 3.11393 4.64084 3.375V6.75C4.64084 6.86189 4.68529 6.96919 4.76441 7.04831C4.84353 7.12743 4.95083 7.17188 5.06272 7.17188C5.17461 7.17188 5.28191 7.12743 5.36103 7.04831C5.44015 6.96919 5.48459 6.86189 5.48459 6.75V3.375C5.48459 3.3377 5.49941 3.30194 5.52578 3.27556C5.55215 3.24919 5.58792 3.23438 5.62522 3.23438H14.6252C14.6625 3.23438 14.6983 3.24919 14.7247 3.27556C14.751 3.30194 14.7658 3.3377 14.7658 3.375V12.375C14.7658 12.4123 14.751 12.4481 14.7247 12.4744C14.6983 12.5008 14.6625 12.5156 14.6252 12.5156H11.2502C11.1383 12.5156 11.031 12.5601 10.9519 12.6392C10.8728 12.7183 10.8283 12.8256 10.8283 12.9375C10.8283 13.0494 10.8728 13.1567 10.9519 13.2358C11.031 13.3149 11.1383 13.3594 11.2502 13.3594H14.6252C14.8863 13.3594 15.1367 13.2557 15.3213 13.0711C15.5059 12.8865 15.6096 12.6361 15.6096 12.375V3.375C15.6096 3.11393 15.5059 2.86355 15.3213 2.67894C15.1367 2.49434 14.8863 2.39062 14.6252 2.39062Z",
          "fill" : "black"
        },
        {
          "id": "3",
          "name": "Product",
          "url": "/profile/product",
          "icon": "M12.7969 7.875C12.7969 7.98689 12.7524 8.09419 12.6733 8.17331C12.5942 8.25243 12.4869 8.29688 12.375 8.29688H6.75C6.63811 8.29688 6.53081 8.25243 6.45169 8.17331C6.37257 8.09419 6.32812 7.98689 6.32812 7.875C6.32812 7.76311 6.37257 7.65581 6.45169 7.57669C6.53081 7.49757 6.63811 7.45312 6.75 7.45312H12.375C12.4869 7.45312 12.5942 7.49757 12.6733 7.57669C12.7524 7.65581 12.7969 7.76311 12.7969 7.875ZM12.375 9.70312H6.75C6.63811 9.70312 6.53081 9.74757 6.45169 9.82669C6.37257 9.90581 6.32812 10.0131 6.32812 10.125C6.32812 10.2369 6.37257 10.3442 6.45169 10.4233C6.53081 10.5024 6.63811 10.5469 6.75 10.5469H12.375C12.4869 10.5469 12.5942 10.5024 12.6733 10.4233C12.7524 10.3442 12.7969 10.2369 12.7969 10.125C12.7969 10.0131 12.7524 9.90581 12.6733 9.82669C12.5942 9.74757 12.4869 9.70312 12.375 9.70312ZM16.1719 4.5V12.9375C16.1719 13.3478 16.0089 13.7412 15.7188 14.0313C15.4287 14.3214 15.0353 14.4844 14.625 14.4844H2.25C1.84084 14.4844 1.44834 14.3223 1.15843 14.0335C0.868511 13.7448 0.704799 13.353 0.703125 12.9438V6.1875C0.703125 6.07561 0.747572 5.96831 0.826689 5.88919C0.905806 5.81007 1.01311 5.76562 1.125 5.76562C1.23689 5.76562 1.34419 5.81007 1.42331 5.88919C1.50243 5.96831 1.54688 6.07561 1.54688 6.1875V12.9375C1.54688 13.124 1.62095 13.3028 1.75282 13.4347C1.88468 13.5665 2.06352 13.6406 2.25 13.6406C2.43648 13.6406 2.61532 13.5665 2.74718 13.4347C2.87905 13.3028 2.95312 13.124 2.95312 12.9375V4.5C2.95312 4.23893 3.05684 3.98855 3.24144 3.80394C3.42605 3.61934 3.67643 3.51563 3.9375 3.51562H15.1875C15.4486 3.51562 15.699 3.61934 15.8836 3.80394C16.0682 3.98855 16.1719 4.23893 16.1719 4.5ZM15.3281 4.5C15.3281 4.4627 15.3133 4.42694 15.2869 4.40056C15.2606 4.37419 15.2248 4.35938 15.1875 4.35938H3.9375C3.9002 4.35938 3.86444 4.37419 3.83806 4.40056C3.81169 4.42694 3.79688 4.4627 3.79688 4.5V12.9375C3.79718 13.182 3.73908 13.4231 3.62742 13.6406H14.625C14.8115 13.6406 14.9903 13.5665 15.1222 13.4347C15.254 13.3028 15.3281 13.124 15.3281 12.9375V4.5Z",
          "fill":"#343330"
        },
        {
          "id": "4",
          "name": "Product Category",
          "url": "/profile/productCateogry",
          "icon": "M12.7969 7.875C12.7969 7.98689 12.7524 8.09419 12.6733 8.17331C12.5942 8.25243 12.4869 8.29688 12.375 8.29688H6.75C6.63811 8.29688 6.53081 8.25243 6.45169 8.17331C6.37257 8.09419 6.32812 7.98689 6.32812 7.875C6.32812 7.76311 6.37257 7.65581 6.45169 7.57669C6.53081 7.49757 6.63811 7.45312 6.75 7.45312H12.375C12.4869 7.45312 12.5942 7.49757 12.6733 7.57669C12.7524 7.65581 12.7969 7.76311 12.7969 7.875ZM12.375 9.70312H6.75C6.63811 9.70312 6.53081 9.74757 6.45169 9.82669C6.37257 9.90581 6.32812 10.0131 6.32812 10.125C6.32812 10.2369 6.37257 10.3442 6.45169 10.4233C6.53081 10.5024 6.63811 10.5469 6.75 10.5469H12.375C12.4869 10.5469 12.5942 10.5024 12.6733 10.4233C12.7524 10.3442 12.7969 10.2369 12.7969 10.125C12.7969 10.0131 12.7524 9.90581 12.6733 9.82669C12.5942 9.74757 12.4869 9.70312 12.375 9.70312ZM16.1719 4.5V12.9375C16.1719 13.3478 16.0089 13.7412 15.7188 14.0313C15.4287 14.3214 15.0353 14.4844 14.625 14.4844H2.25C1.84084 14.4844 1.44834 14.3223 1.15843 14.0335C0.868511 13.7448 0.704799 13.353 0.703125 12.9438V6.1875C0.703125 6.07561 0.747572 5.96831 0.826689 5.88919C0.905806 5.81007 1.01311 5.76562 1.125 5.76562C1.23689 5.76562 1.34419 5.81007 1.42331 5.88919C1.50243 5.96831 1.54688 6.07561 1.54688 6.1875V12.9375C1.54688 13.124 1.62095 13.3028 1.75282 13.4347C1.88468 13.5665 2.06352 13.6406 2.25 13.6406C2.43648 13.6406 2.61532 13.5665 2.74718 13.4347C2.87905 13.3028 2.95312 13.124 2.95312 12.9375V4.5C2.95312 4.23893 3.05684 3.98855 3.24144 3.80394C3.42605 3.61934 3.67643 3.51563 3.9375 3.51562H15.1875C15.4486 3.51562 15.699 3.61934 15.8836 3.80394C16.0682 3.98855 16.1719 4.23893 16.1719 4.5ZM15.3281 4.5C15.3281 4.4627 15.3133 4.42694 15.2869 4.40056C15.2606 4.37419 15.2248 4.35938 15.1875 4.35938H3.9375C3.9002 4.35938 3.86444 4.37419 3.83806 4.40056C3.81169 4.42694 3.79688 4.4627 3.79688 4.5V12.9375C3.79718 13.182 3.73908 13.4231 3.62742 13.6406H14.625C14.8115 13.6406 14.9903 13.5665 15.1222 13.4347C15.254 13.3028 15.3281 13.124 15.3281 12.9375V4.5Z",
          "fill":"#343330"
        }
      ]
    },
    {
      'heading': 'Utilities',
      items: [
        {
          "id": "5",
          "name": "Purchase Order",
          "url": "/bills/purchaseOrder",
          "icon": "M12.7969 7.875C12.7969 7.98689 12.7524 8.09419 12.6733 8.17331C12.5942 8.25243 12.4869 8.29688 12.375 8.29688H6.75C6.63811 8.29688 6.53081 8.25243 6.45169 8.17331C6.37257 8.09419 6.32812 7.98689 6.32812 7.875C6.32812 7.76311 6.37257 7.65581 6.45169 7.57669C6.53081 7.49757 6.63811 7.45312 6.75 7.45312H12.375C12.4869 7.45312 12.5942 7.49757 12.6733 7.57669C12.7524 7.65581 12.7969 7.76311 12.7969 7.875ZM12.375 9.70312H6.75C6.63811 9.70312 6.53081 9.74757 6.45169 9.82669C6.37257 9.90581 6.32812 10.0131 6.32812 10.125C6.32812 10.2369 6.37257 10.3442 6.45169 10.4233C6.53081 10.5024 6.63811 10.5469 6.75 10.5469H12.375C12.4869 10.5469 12.5942 10.5024 12.6733 10.4233C12.7524 10.3442 12.7969 10.2369 12.7969 10.125C12.7969 10.0131 12.7524 9.90581 12.6733 9.82669C12.5942 9.74757 12.4869 9.70312 12.375 9.70312ZM16.1719 4.5V12.9375C16.1719 13.3478 16.0089 13.7412 15.7188 14.0313C15.4287 14.3214 15.0353 14.4844 14.625 14.4844H2.25C1.84084 14.4844 1.44834 14.3223 1.15843 14.0335C0.868511 13.7448 0.704799 13.353 0.703125 12.9438V6.1875C0.703125 6.07561 0.747572 5.96831 0.826689 5.88919C0.905806 5.81007 1.01311 5.76562 1.125 5.76562C1.23689 5.76562 1.34419 5.81007 1.42331 5.88919C1.50243 5.96831 1.54688 6.07561 1.54688 6.1875V12.9375C1.54688 13.124 1.62095 13.3028 1.75282 13.4347C1.88468 13.5665 2.06352 13.6406 2.25 13.6406C2.43648 13.6406 2.61532 13.5665 2.74718 13.4347C2.87905 13.3028 2.95312 13.124 2.95312 12.9375V4.5C2.95312 4.23893 3.05684 3.98855 3.24144 3.80394C3.42605 3.61934 3.67643 3.51563 3.9375 3.51562H15.1875C15.4486 3.51562 15.699 3.61934 15.8836 3.80394C16.0682 3.98855 16.1719 4.23893 16.1719 4.5ZM15.3281 4.5C15.3281 4.4627 15.3133 4.42694 15.2869 4.40056C15.2606 4.37419 15.2248 4.35938 15.1875 4.35938H3.9375C3.9002 4.35938 3.86444 4.37419 3.83806 4.40056C3.81169 4.42694 3.79688 4.4627 3.79688 4.5V12.9375C3.79718 13.182 3.73908 13.4231 3.62742 13.6406H14.625C14.8115 13.6406 14.9903 13.5665 15.1222 13.4347C15.254 13.3028 15.3281 13.124 15.3281 12.9375V4.5Z",
          "fill":"#343330"
        },
        {
          "id": "6",
          "name": "Purchase Invoice",
          "url": "/collect/purchaseInvoice",
          "icon": "M12.7969 7.3125C12.7969 7.42439 12.7524 7.53169 12.6733 7.61081C12.5942 7.68993 12.4869 7.73438 12.375 7.73438H5.625C5.51311 7.73438 5.40581 7.68993 5.32669 7.61081C5.24757 7.53169 5.20312 7.42439 5.20312 7.3125C5.20312 7.20061 5.24757 7.09331 5.32669 7.01419C5.40581 6.93507 5.51311 6.89062 5.625 6.89062H12.375C12.4869 6.89062 12.5942 6.93507 12.6733 7.01419C12.7524 7.09331 12.7969 7.20061 12.7969 7.3125ZM12.375 9.14062H5.625C5.51311 9.14062 5.40581 9.18507 5.32669 9.26419C5.24757 9.34331 5.20312 9.45061 5.20312 9.5625C5.20312 9.67439 5.24757 9.78169 5.32669 9.86081C5.40581 9.93993 5.51311 9.98438 5.625 9.98438H12.375C12.4869 9.98438 12.5942 9.93993 12.6733 9.86081C12.7524 9.78169 12.7969 9.67439 12.7969 9.5625C12.7969 9.45061 12.7524 9.34331 12.6733 9.26419C12.5942 9.18507 12.4869 9.14062 12.375 9.14062ZM16.1719 3.9375V14.625C16.1718 14.6969 16.1533 14.7676 16.1183 14.8303C16.0832 14.8931 16.0327 14.9458 15.9715 14.9836C15.9051 15.0251 15.8283 15.047 15.75 15.0469C15.6846 15.0469 15.6201 15.0317 15.5616 15.0026L13.5 13.9718L11.4384 15.0026C11.3799 15.0318 11.3154 15.047 11.25 15.047C11.1846 15.047 11.1201 15.0318 11.0616 15.0026L9 13.9718L6.93844 15.0026C6.87992 15.0318 6.81541 15.047 6.75 15.047C6.68459 15.047 6.62008 15.0318 6.56156 15.0026L4.5 13.9718L2.43844 15.0026C2.37411 15.0347 2.30264 15.0498 2.23081 15.0466C2.15899 15.0433 2.08919 15.0217 2.02804 14.9839C1.9669 14.9461 1.91644 14.8932 1.88145 14.8304C1.84646 14.7676 1.8281 14.6969 1.82813 14.625V3.9375C1.82813 3.67643 1.93184 3.42605 2.11644 3.24144C2.30105 3.05684 2.55143 2.95312 2.8125 2.95312H15.1875C15.4486 2.95313 15.699 3.05684 15.8836 3.24144C16.0682 3.42605 16.1719 3.67643 16.1719 3.9375ZM15.3281 3.9375C15.3281 3.9002 15.3133 3.86444 15.2869 3.83806C15.2606 3.81169 15.2248 3.79688 15.1875 3.79688H2.8125C2.7752 3.79688 2.73944 3.81169 2.71306 3.83806C2.68669 3.86444 2.67188 3.9002 2.67188 3.9375V13.9423L4.31156 13.1224C4.37008 13.0932 4.43459 13.078 4.5 13.078C4.56541 13.078 4.62992 13.0932 4.68844 13.1224L6.75 14.1532L8.81156 13.1224C8.87008 13.0932 8.93459 13.078 9 13.078C9.06541 13.078 9.12992 13.0932 9.18844 13.1224L11.25 14.1532L13.3116 13.1224C13.3701 13.0932 13.4346 13.078 13.5 13.078C13.5654 13.078 13.6299 13.0932 13.6884 13.1224L15.3281 13.9423V3.9375Z",
          "fill": "black"
        },
        {
          "id": "7",
          "name": "Sales Order",
          "url": "/invoice/salesOrder",
          "icon": "M12.7969 7.875C12.7969 7.98689 12.7524 8.09419 12.6733 8.17331C12.5942 8.25243 12.4869 8.29688 12.375 8.29688H6.75C6.63811 8.29688 6.53081 8.25243 6.45169 8.17331C6.37257 8.09419 6.32812 7.98689 6.32812 7.875C6.32812 7.76311 6.37257 7.65581 6.45169 7.57669C6.53081 7.49757 6.63811 7.45312 6.75 7.45312H12.375C12.4869 7.45312 12.5942 7.49757 12.6733 7.57669C12.7524 7.65581 12.7969 7.76311 12.7969 7.875ZM12.375 9.70312H6.75C6.63811 9.70312 6.53081 9.74757 6.45169 9.82669C6.37257 9.90581 6.32812 10.0131 6.32812 10.125C6.32812 10.2369 6.37257 10.3442 6.45169 10.4233C6.53081 10.5024 6.63811 10.5469 6.75 10.5469H12.375C12.4869 10.5469 12.5942 10.5024 12.6733 10.4233C12.7524 10.3442 12.7969 10.2369 12.7969 10.125C12.7969 10.0131 12.7524 9.90581 12.6733 9.82669C12.5942 9.74757 12.4869 9.70312 12.375 9.70312ZM16.1719 4.5V12.9375C16.1719 13.3478 16.0089 13.7412 15.7188 14.0313C15.4287 14.3214 15.0353 14.4844 14.625 14.4844H2.25C1.84084 14.4844 1.44834 14.3223 1.15843 14.0335C0.868511 13.7448 0.704799 13.353 0.703125 12.9438V6.1875C0.703125 6.07561 0.747572 5.96831 0.826689 5.88919C0.905806 5.81007 1.01311 5.76562 1.125 5.76562C1.23689 5.76562 1.34419 5.81007 1.42331 5.88919C1.50243 5.96831 1.54688 6.07561 1.54688 6.1875V12.9375C1.54688 13.124 1.62095 13.3028 1.75282 13.4347C1.88468 13.5665 2.06352 13.6406 2.25 13.6406C2.43648 13.6406 2.61532 13.5665 2.74718 13.4347C2.87905 13.3028 2.95312 13.124 2.95312 12.9375V4.5C2.95312 4.23893 3.05684 3.98855 3.24144 3.80394C3.42605 3.61934 3.67643 3.51563 3.9375 3.51562H15.1875C15.4486 3.51562 15.699 3.61934 15.8836 3.80394C16.0682 3.98855 16.1719 4.23893 16.1719 4.5ZM15.3281 4.5C15.3281 4.4627 15.3133 4.42694 15.2869 4.40056C15.2606 4.37419 15.2248 4.35938 15.1875 4.35938H3.9375C3.9002 4.35938 3.86444 4.37419 3.83806 4.40056C3.81169 4.42694 3.79688 4.4627 3.79688 4.5V12.9375C3.79718 13.182 3.73908 13.4231 3.62742 13.6406H14.625C14.8115 13.6406 14.9903 13.5665 15.1222 13.4347C15.254 13.3028 15.3281 13.124 15.3281 12.9375V4.5Z",
          "fill":"#343330"
        },
        {
          "id": "8",
          "name": "Sales Invoice",
          "url": "/invoice/salesInvoice",
          "icon": "M12.7969 7.3125C12.7969 7.42439 12.7524 7.53169 12.6733 7.61081C12.5942 7.68993 12.4869 7.73438 12.375 7.73438H5.625C5.51311 7.73438 5.40581 7.68993 5.32669 7.61081C5.24757 7.53169 5.20312 7.42439 5.20312 7.3125C5.20312 7.20061 5.24757 7.09331 5.32669 7.01419C5.40581 6.93507 5.51311 6.89062 5.625 6.89062H12.375C12.4869 6.89062 12.5942 6.93507 12.6733 7.01419C12.7524 7.09331 12.7969 7.20061 12.7969 7.3125ZM12.375 9.14062H5.625C5.51311 9.14062 5.40581 9.18507 5.32669 9.26419C5.24757 9.34331 5.20312 9.45061 5.20312 9.5625C5.20312 9.67439 5.24757 9.78169 5.32669 9.86081C5.40581 9.93993 5.51311 9.98438 5.625 9.98438H12.375C12.4869 9.98438 12.5942 9.93993 12.6733 9.86081C12.7524 9.78169 12.7969 9.67439 12.7969 9.5625C12.7969 9.45061 12.7524 9.34331 12.6733 9.26419C12.5942 9.18507 12.4869 9.14062 12.375 9.14062ZM16.1719 3.9375V14.625C16.1718 14.6969 16.1533 14.7676 16.1183 14.8303C16.0832 14.8931 16.0327 14.9458 15.9715 14.9836C15.9051 15.0251 15.8283 15.047 15.75 15.0469C15.6846 15.0469 15.6201 15.0317 15.5616 15.0026L13.5 13.9718L11.4384 15.0026C11.3799 15.0318 11.3154 15.047 11.25 15.047C11.1846 15.047 11.1201 15.0318 11.0616 15.0026L9 13.9718L6.93844 15.0026C6.87992 15.0318 6.81541 15.047 6.75 15.047C6.68459 15.047 6.62008 15.0318 6.56156 15.0026L4.5 13.9718L2.43844 15.0026C2.37411 15.0347 2.30264 15.0498 2.23081 15.0466C2.15899 15.0433 2.08919 15.0217 2.02804 14.9839C1.9669 14.9461 1.91644 14.8932 1.88145 14.8304C1.84646 14.7676 1.8281 14.6969 1.82813 14.625V3.9375C1.82813 3.67643 1.93184 3.42605 2.11644 3.24144C2.30105 3.05684 2.55143 2.95312 2.8125 2.95312H15.1875C15.4486 2.95313 15.699 3.05684 15.8836 3.24144C16.0682 3.42605 16.1719 3.67643 16.1719 3.9375ZM15.3281 3.9375C15.3281 3.9002 15.3133 3.86444 15.2869 3.83806C15.2606 3.81169 15.2248 3.79688 15.1875 3.79688H2.8125C2.7752 3.79688 2.73944 3.81169 2.71306 3.83806C2.68669 3.86444 2.67188 3.9002 2.67188 3.9375V13.9423L4.31156 13.1224C4.37008 13.0932 4.43459 13.078 4.5 13.078C4.56541 13.078 4.62992 13.0932 4.68844 13.1224L6.75 14.1532L8.81156 13.1224C8.87008 13.0932 8.93459 13.078 9 13.078C9.06541 13.078 9.12992 13.0932 9.18844 13.1224L11.25 14.1532L13.3116 13.1224C13.3701 13.0932 13.4346 13.078 13.5 13.078C13.5654 13.078 13.6299 13.0932 13.6884 13.1224L15.3281 13.9423V3.9375Z",
          "fill": "black"
        },
        {
          "id": "9",
          "name": "Vendor Invoice",
          "url": "/invoice/vendorInvoice",
          "icon": "M12.7969 7.3125C12.7969 7.42439 12.7524 7.53169 12.6733 7.61081C12.5942 7.68993 12.4869 7.73438 12.375 7.73438H5.625C5.51311 7.73438 5.40581 7.68993 5.32669 7.61081C5.24757 7.53169 5.20312 7.42439 5.20312 7.3125C5.20312 7.20061 5.24757 7.09331 5.32669 7.01419C5.40581 6.93507 5.51311 6.89062 5.625 6.89062H12.375C12.4869 6.89062 12.5942 6.93507 12.6733 7.01419C12.7524 7.09331 12.7969 7.20061 12.7969 7.3125ZM12.375 9.14062H5.625C5.51311 9.14062 5.40581 9.18507 5.32669 9.26419C5.24757 9.34331 5.20312 9.45061 5.20312 9.5625C5.20312 9.67439 5.24757 9.78169 5.32669 9.86081C5.40581 9.93993 5.51311 9.98438 5.625 9.98438H12.375C12.4869 9.98438 12.5942 9.93993 12.6733 9.86081C12.7524 9.78169 12.7969 9.67439 12.7969 9.5625C12.7969 9.45061 12.7524 9.34331 12.6733 9.26419C12.5942 9.18507 12.4869 9.14062 12.375 9.14062ZM16.1719 3.9375V14.625C16.1718 14.6969 16.1533 14.7676 16.1183 14.8303C16.0832 14.8931 16.0327 14.9458 15.9715 14.9836C15.9051 15.0251 15.8283 15.047 15.75 15.0469C15.6846 15.0469 15.6201 15.0317 15.5616 15.0026L13.5 13.9718L11.4384 15.0026C11.3799 15.0318 11.3154 15.047 11.25 15.047C11.1846 15.047 11.1201 15.0318 11.0616 15.0026L9 13.9718L6.93844 15.0026C6.87992 15.0318 6.81541 15.047 6.75 15.047C6.68459 15.047 6.62008 15.0318 6.56156 15.0026L4.5 13.9718L2.43844 15.0026C2.37411 15.0347 2.30264 15.0498 2.23081 15.0466C2.15899 15.0433 2.08919 15.0217 2.02804 14.9839C1.9669 14.9461 1.91644 14.8932 1.88145 14.8304C1.84646 14.7676 1.8281 14.6969 1.82813 14.625V3.9375C1.82813 3.67643 1.93184 3.42605 2.11644 3.24144C2.30105 3.05684 2.55143 2.95312 2.8125 2.95312H15.1875C15.4486 2.95313 15.699 3.05684 15.8836 3.24144C16.0682 3.42605 16.1719 3.67643 16.1719 3.9375ZM15.3281 3.9375C15.3281 3.9002 15.3133 3.86444 15.2869 3.83806C15.2606 3.81169 15.2248 3.79688 15.1875 3.79688H2.8125C2.7752 3.79688 2.73944 3.81169 2.71306 3.83806C2.68669 3.86444 2.67188 3.9002 2.67188 3.9375V13.9423L4.31156 13.1224C4.37008 13.0932 4.43459 13.078 4.5 13.078C4.56541 13.078 4.62992 13.0932 4.68844 13.1224L6.75 14.1532L8.81156 13.1224C8.87008 13.0932 8.93459 13.078 9 13.078C9.06541 13.078 9.12992 13.0932 9.18844 13.1224L11.25 14.1532L13.3116 13.1224C13.3701 13.0932 13.4346 13.078 13.5 13.078C13.5654 13.078 13.6299 13.0932 13.6884 13.1224L15.3281 13.9423V3.9375Z",
          "fill": "black"
        },
        {
          "id": "10",
          "name": "Receipt Note",
          "url": "/bills/receiptNote",
          "icon": "M14.9231 5.88938L10.9856 1.95188C10.9066 1.87274 10.7994 1.82822 10.6875 1.82812H3.9375C3.67643 1.82812 3.42605 1.93184 3.24144 2.11644C3.05684 2.30105 2.95313 2.55143 2.95312 2.8125V15.1875C2.95313 15.4486 3.05684 15.699 3.24144 15.8836C3.42605 16.0682 3.67643 16.1719 3.9375 16.1719H14.0625C14.3236 16.1719 14.574 16.0682 14.7586 15.8836C14.9432 15.699 15.0469 15.4486 15.0469 15.1875V6.1875C15.0468 6.07565 15.0023 5.96842 14.9231 5.88938ZM11.1094 3.26812L13.6069 5.76562H11.1094V3.26812ZM14.0625 15.3281H3.9375C3.9002 15.3281 3.86444 15.3133 3.83806 15.2869C3.81169 15.2606 3.79688 15.2248 3.79688 15.1875V2.8125C3.79688 2.7752 3.81169 2.73944 3.83806 2.71306C3.86444 2.68669 3.9002 2.67188 3.9375 2.67188H10.2656V6.1875C10.2656 6.29939 10.3101 6.40669 10.3892 6.48581C10.4683 6.56493 10.5756 6.60938 10.6875 6.60938H14.2031V15.1875C14.2031 15.2248 14.1883 15.2606 14.1619 15.2869C14.1356 15.3133 14.0998 15.3281 14.0625 15.3281ZM11.6719 9.5625C11.6719 9.67439 11.6274 9.78169 11.5483 9.86081C11.4692 9.93993 11.3619 9.98438 11.25 9.98438H6.75C6.63811 9.98438 6.53081 9.93993 6.45169 9.86081C6.37257 9.78169 6.32812 9.67439 6.32812 9.5625C6.32812 9.45061 6.37257 9.34331 6.45169 9.26419C6.53081 9.18507 6.63811 9.14062 6.75 9.14062H11.25C11.3619 9.14062 11.4692 9.18507 11.5483 9.26419C11.6274 9.34331 11.6719 9.45061 11.6719 9.5625ZM11.6719 11.8125C11.6719 11.9244 11.6274 12.0317 11.5483 12.1108C11.4692 12.1899 11.3619 12.2344 11.25 12.2344H6.75C6.63811 12.2344 6.53081 12.1899 6.45169 12.1108C6.37257 12.0317 6.32812 11.9244 6.32812 11.8125C6.32812 11.7006 6.37257 11.5933 6.45169 11.5142C6.53081 11.4351 6.63811 11.3906 6.75 11.3906H11.25C11.3619 11.3906 11.4692 11.4351 11.5483 11.5142C11.6274 11.5933 11.6719 11.7006 11.6719 11.8125Z",
          "fill": "#343330"
        },
        {
          "id": "11",
          "name": "Debit Note",
          "url": "/bills/debitNote",
          "icon": "M14.9231 5.88938L10.9856 1.95188C10.9066 1.87274 10.7994 1.82822 10.6875 1.82812H3.9375C3.67643 1.82812 3.42605 1.93184 3.24144 2.11644C3.05684 2.30105 2.95313 2.55143 2.95312 2.8125V15.1875C2.95313 15.4486 3.05684 15.699 3.24144 15.8836C3.42605 16.0682 3.67643 16.1719 3.9375 16.1719H14.0625C14.3236 16.1719 14.574 16.0682 14.7586 15.8836C14.9432 15.699 15.0469 15.4486 15.0469 15.1875V6.1875C15.0468 6.07565 15.0023 5.96842 14.9231 5.88938ZM11.1094 3.26812L13.6069 5.76562H11.1094V3.26812ZM14.0625 15.3281H3.9375C3.9002 15.3281 3.86444 15.3133 3.83806 15.2869C3.81169 15.2606 3.79688 15.2248 3.79688 15.1875V2.8125C3.79688 2.7752 3.81169 2.73944 3.83806 2.71306C3.86444 2.68669 3.9002 2.67188 3.9375 2.67188H10.2656V6.1875C10.2656 6.29939 10.3101 6.40669 10.3892 6.48581C10.4683 6.56493 10.5756 6.60938 10.6875 6.60938H14.2031V15.1875C14.2031 15.2248 14.1883 15.2606 14.1619 15.2869C14.1356 15.3133 14.0998 15.3281 14.0625 15.3281ZM11.6719 9.5625C11.6719 9.67439 11.6274 9.78169 11.5483 9.86081C11.4692 9.93993 11.3619 9.98438 11.25 9.98438H6.75C6.63811 9.98438 6.53081 9.93993 6.45169 9.86081C6.37257 9.78169 6.32812 9.67439 6.32812 9.5625C6.32812 9.45061 6.37257 9.34331 6.45169 9.26419C6.53081 9.18507 6.63811 9.14062 6.75 9.14062H11.25C11.3619 9.14062 11.4692 9.18507 11.5483 9.26419C11.6274 9.34331 11.6719 9.45061 11.6719 9.5625ZM11.6719 11.8125C11.6719 11.9244 11.6274 12.0317 11.5483 12.1108C11.4692 12.1899 11.3619 12.2344 11.25 12.2344H6.75C6.63811 12.2344 6.53081 12.1899 6.45169 12.1108C6.37257 12.0317 6.32812 11.9244 6.32812 11.8125C6.32812 11.7006 6.37257 11.5933 6.45169 11.5142C6.53081 11.4351 6.63811 11.3906 6.75 11.3906H11.25C11.3619 11.3906 11.4692 11.4351 11.5483 11.5142C11.6274 11.5933 11.6719 11.7006 11.6719 11.8125Z",
          "fill": "#343330"
        },
        {
          "id": "12",
          "name": "Credit Note",
          "url": "/invoice/creditNote",
          "icon": "M14.9231 5.88938L10.9856 1.95188C10.9066 1.87274 10.7994 1.82822 10.6875 1.82812H3.9375C3.67643 1.82812 3.42605 1.93184 3.24144 2.11644C3.05684 2.30105 2.95313 2.55143 2.95312 2.8125V15.1875C2.95313 15.4486 3.05684 15.699 3.24144 15.8836C3.42605 16.0682 3.67643 16.1719 3.9375 16.1719H14.0625C14.3236 16.1719 14.574 16.0682 14.7586 15.8836C14.9432 15.699 15.0469 15.4486 15.0469 15.1875V6.1875C15.0468 6.07565 15.0023 5.96842 14.9231 5.88938ZM11.1094 3.26812L13.6069 5.76562H11.1094V3.26812ZM14.0625 15.3281H3.9375C3.9002 15.3281 3.86444 15.3133 3.83806 15.2869C3.81169 15.2606 3.79688 15.2248 3.79688 15.1875V2.8125C3.79688 2.7752 3.81169 2.73944 3.83806 2.71306C3.86444 2.68669 3.9002 2.67188 3.9375 2.67188H10.2656V6.1875C10.2656 6.29939 10.3101 6.40669 10.3892 6.48581C10.4683 6.56493 10.5756 6.60938 10.6875 6.60938H14.2031V15.1875C14.2031 15.2248 14.1883 15.2606 14.1619 15.2869C14.1356 15.3133 14.0998 15.3281 14.0625 15.3281ZM11.6719 9.5625C11.6719 9.67439 11.6274 9.78169 11.5483 9.86081C11.4692 9.93993 11.3619 9.98438 11.25 9.98438H6.75C6.63811 9.98438 6.53081 9.93993 6.45169 9.86081C6.37257 9.78169 6.32812 9.67439 6.32812 9.5625C6.32812 9.45061 6.37257 9.34331 6.45169 9.26419C6.53081 9.18507 6.63811 9.14062 6.75 9.14062H11.25C11.3619 9.14062 11.4692 9.18507 11.5483 9.26419C11.6274 9.34331 11.6719 9.45061 11.6719 9.5625ZM11.6719 11.8125C11.6719 11.9244 11.6274 12.0317 11.5483 12.1108C11.4692 12.1899 11.3619 12.2344 11.25 12.2344H6.75C6.63811 12.2344 6.53081 12.1899 6.45169 12.1108C6.37257 12.0317 6.32812 11.9244 6.32812 11.8125C6.32812 11.7006 6.37257 11.5933 6.45169 11.5142C6.53081 11.4351 6.63811 11.3906 6.75 11.3906H11.25C11.3619 11.3906 11.4692 11.4351 11.5483 11.5142C11.6274 11.5933 11.6719 11.7006 11.6719 11.8125Z",
          "fill": "#343330"
        },
        {
          "id": "13",
          "name": "Cash Memo",
          "url": "/invoice/cashMemo",
          "icon": "M14.9231 5.88938L10.9856 1.95188C10.9066 1.87274 10.7994 1.82822 10.6875 1.82812H3.9375C3.67643 1.82812 3.42605 1.93184 3.24144 2.11644C3.05684 2.30105 2.95313 2.55143 2.95312 2.8125V15.1875C2.95313 15.4486 3.05684 15.699 3.24144 15.8836C3.42605 16.0682 3.67643 16.1719 3.9375 16.1719H14.0625C14.3236 16.1719 14.574 16.0682 14.7586 15.8836C14.9432 15.699 15.0469 15.4486 15.0469 15.1875V6.1875C15.0468 6.07565 15.0023 5.96842 14.9231 5.88938ZM11.1094 3.26812L13.6069 5.76562H11.1094V3.26812ZM14.0625 15.3281H3.9375C3.9002 15.3281 3.86444 15.3133 3.83806 15.2869C3.81169 15.2606 3.79688 15.2248 3.79688 15.1875V2.8125C3.79688 2.7752 3.81169 2.73944 3.83806 2.71306C3.86444 2.68669 3.9002 2.67188 3.9375 2.67188H10.2656V6.1875C10.2656 6.29939 10.3101 6.40669 10.3892 6.48581C10.4683 6.56493 10.5756 6.60938 10.6875 6.60938H14.2031V15.1875C14.2031 15.2248 14.1883 15.2606 14.1619 15.2869C14.1356 15.3133 14.0998 15.3281 14.0625 15.3281ZM11.6719 9.5625C11.6719 9.67439 11.6274 9.78169 11.5483 9.86081C11.4692 9.93993 11.3619 9.98438 11.25 9.98438H6.75C6.63811 9.98438 6.53081 9.93993 6.45169 9.86081C6.37257 9.78169 6.32812 9.67439 6.32812 9.5625C6.32812 9.45061 6.37257 9.34331 6.45169 9.26419C6.53081 9.18507 6.63811 9.14062 6.75 9.14062H11.25C11.3619 9.14062 11.4692 9.18507 11.5483 9.26419C11.6274 9.34331 11.6719 9.45061 11.6719 9.5625ZM11.6719 11.8125C11.6719 11.9244 11.6274 12.0317 11.5483 12.1108C11.4692 12.1899 11.3619 12.2344 11.25 12.2344H6.75C6.63811 12.2344 6.53081 12.1899 6.45169 12.1108C6.37257 12.0317 6.32812 11.9244 6.32812 11.8125C6.32812 11.7006 6.37257 11.5933 6.45169 11.5142C6.53081 11.4351 6.63811 11.3906 6.75 11.3906H11.25C11.3619 11.3906 11.4692 11.4351 11.5483 11.5142C11.6274 11.5933 11.6719 11.7006 11.6719 11.8125Z",
          "fill": "#343330"
        },
        {
          "id": "14",
          "name": "Return & Refund",
          "url": "/pay/returnAndRefund",
          "icon": "M12.7969 7.875C12.7969 7.98689 12.7524 8.09419 12.6733 8.17331C12.5942 8.25243 12.4869 8.29688 12.375 8.29688H6.75C6.63811 8.29688 6.53081 8.25243 6.45169 8.17331C6.37257 8.09419 6.32812 7.98689 6.32812 7.875C6.32812 7.76311 6.37257 7.65581 6.45169 7.57669C6.53081 7.49757 6.63811 7.45312 6.75 7.45312H12.375C12.4869 7.45312 12.5942 7.49757 12.6733 7.57669C12.7524 7.65581 12.7969 7.76311 12.7969 7.875ZM12.375 9.70312H6.75C6.63811 9.70312 6.53081 9.74757 6.45169 9.82669C6.37257 9.90581 6.32812 10.0131 6.32812 10.125C6.32812 10.2369 6.37257 10.3442 6.45169 10.4233C6.53081 10.5024 6.63811 10.5469 6.75 10.5469H12.375C12.4869 10.5469 12.5942 10.5024 12.6733 10.4233C12.7524 10.3442 12.7969 10.2369 12.7969 10.125C12.7969 10.0131 12.7524 9.90581 12.6733 9.82669C12.5942 9.74757 12.4869 9.70312 12.375 9.70312ZM16.1719 4.5V12.9375C16.1719 13.3478 16.0089 13.7412 15.7188 14.0313C15.4287 14.3214 15.0353 14.4844 14.625 14.4844H2.25C1.84084 14.4844 1.44834 14.3223 1.15843 14.0335C0.868511 13.7448 0.704799 13.353 0.703125 12.9438V6.1875C0.703125 6.07561 0.747572 5.96831 0.826689 5.88919C0.905806 5.81007 1.01311 5.76562 1.125 5.76562C1.23689 5.76562 1.34419 5.81007 1.42331 5.88919C1.50243 5.96831 1.54688 6.07561 1.54688 6.1875V12.9375C1.54688 13.124 1.62095 13.3028 1.75282 13.4347C1.88468 13.5665 2.06352 13.6406 2.25 13.6406C2.43648 13.6406 2.61532 13.5665 2.74718 13.4347C2.87905 13.3028 2.95312 13.124 2.95312 12.9375V4.5C2.95312 4.23893 3.05684 3.98855 3.24144 3.80394C3.42605 3.61934 3.67643 3.51563 3.9375 3.51562H15.1875C15.4486 3.51562 15.699 3.61934 15.8836 3.80394C16.0682 3.98855 16.1719 4.23893 16.1719 4.5ZM15.3281 4.5C15.3281 4.4627 15.3133 4.42694 15.2869 4.40056C15.2606 4.37419 15.2248 4.35938 15.1875 4.35938H3.9375C3.9002 4.35938 3.86444 4.37419 3.83806 4.40056C3.81169 4.42694 3.79688 4.4627 3.79688 4.5V12.9375C3.79718 13.182 3.73908 13.4231 3.62742 13.6406H14.625C14.8115 13.6406 14.9903 13.5665 15.1222 13.4347C15.254 13.3028 15.3281 13.124 15.3281 12.9375V4.5Z",
          "fill":"#343330"
        },
        {
          "id": "15",
          "name": "Beneficairy",
          "url": "/profile/beneficiary/create",
          "icon": "M12.7969 7.875C12.7969 7.98689 12.7524 8.09419 12.6733 8.17331C12.5942 8.25243 12.4869 8.29688 12.375 8.29688H6.75C6.63811 8.29688 6.53081 8.25243 6.45169 8.17331C6.37257 8.09419 6.32812 7.98689 6.32812 7.875C6.32812 7.76311 6.37257 7.65581 6.45169 7.57669C6.53081 7.49757 6.63811 7.45312 6.75 7.45312H12.375C12.4869 7.45312 12.5942 7.49757 12.6733 7.57669C12.7524 7.65581 12.7969 7.76311 12.7969 7.875ZM12.375 9.70312H6.75C6.63811 9.70312 6.53081 9.74757 6.45169 9.82669C6.37257 9.90581 6.32812 10.0131 6.32812 10.125C6.32812 10.2369 6.37257 10.3442 6.45169 10.4233C6.53081 10.5024 6.63811 10.5469 6.75 10.5469H12.375C12.4869 10.5469 12.5942 10.5024 12.6733 10.4233C12.7524 10.3442 12.7969 10.2369 12.7969 10.125C12.7969 10.0131 12.7524 9.90581 12.6733 9.82669C12.5942 9.74757 12.4869 9.70312 12.375 9.70312ZM16.1719 4.5V12.9375C16.1719 13.3478 16.0089 13.7412 15.7188 14.0313C15.4287 14.3214 15.0353 14.4844 14.625 14.4844H2.25C1.84084 14.4844 1.44834 14.3223 1.15843 14.0335C0.868511 13.7448 0.704799 13.353 0.703125 12.9438V6.1875C0.703125 6.07561 0.747572 5.96831 0.826689 5.88919C0.905806 5.81007 1.01311 5.76562 1.125 5.76562C1.23689 5.76562 1.34419 5.81007 1.42331 5.88919C1.50243 5.96831 1.54688 6.07561 1.54688 6.1875V12.9375C1.54688 13.124 1.62095 13.3028 1.75282 13.4347C1.88468 13.5665 2.06352 13.6406 2.25 13.6406C2.43648 13.6406 2.61532 13.5665 2.74718 13.4347C2.87905 13.3028 2.95312 13.124 2.95312 12.9375V4.5C2.95312 4.23893 3.05684 3.98855 3.24144 3.80394C3.42605 3.61934 3.67643 3.51563 3.9375 3.51562H15.1875C15.4486 3.51562 15.699 3.61934 15.8836 3.80394C16.0682 3.98855 16.1719 4.23893 16.1719 4.5ZM15.3281 4.5C15.3281 4.4627 15.3133 4.42694 15.2869 4.40056C15.2606 4.37419 15.2248 4.35938 15.1875 4.35938H3.9375C3.9002 4.35938 3.86444 4.37419 3.83806 4.40056C3.81169 4.42694 3.79688 4.4627 3.79688 4.5V12.9375C3.79718 13.182 3.73908 13.4231 3.62742 13.6406H14.625C14.8115 13.6406 14.9903 13.5665 15.1222 13.4347C15.254 13.3028 15.3281 13.124 15.3281 12.9375V4.5Z",
          "fill":"#343330"
        },
        {
          "id": "16",
          "name": "Role",
          "url": "/setting/role/create",
          "icon": "M12.7969 7.875C12.7969 7.98689 12.7524 8.09419 12.6733 8.17331C12.5942 8.25243 12.4869 8.29688 12.375 8.29688H6.75C6.63811 8.29688 6.53081 8.25243 6.45169 8.17331C6.37257 8.09419 6.32812 7.98689 6.32812 7.875C6.32812 7.76311 6.37257 7.65581 6.45169 7.57669C6.53081 7.49757 6.63811 7.45312 6.75 7.45312H12.375C12.4869 7.45312 12.5942 7.49757 12.6733 7.57669C12.7524 7.65581 12.7969 7.76311 12.7969 7.875ZM12.375 9.70312H6.75C6.63811 9.70312 6.53081 9.74757 6.45169 9.82669C6.37257 9.90581 6.32812 10.0131 6.32812 10.125C6.32812 10.2369 6.37257 10.3442 6.45169 10.4233C6.53081 10.5024 6.63811 10.5469 6.75 10.5469H12.375C12.4869 10.5469 12.5942 10.5024 12.6733 10.4233C12.7524 10.3442 12.7969 10.2369 12.7969 10.125C12.7969 10.0131 12.7524 9.90581 12.6733 9.82669C12.5942 9.74757 12.4869 9.70312 12.375 9.70312ZM16.1719 4.5V12.9375C16.1719 13.3478 16.0089 13.7412 15.7188 14.0313C15.4287 14.3214 15.0353 14.4844 14.625 14.4844H2.25C1.84084 14.4844 1.44834 14.3223 1.15843 14.0335C0.868511 13.7448 0.704799 13.353 0.703125 12.9438V6.1875C0.703125 6.07561 0.747572 5.96831 0.826689 5.88919C0.905806 5.81007 1.01311 5.76562 1.125 5.76562C1.23689 5.76562 1.34419 5.81007 1.42331 5.88919C1.50243 5.96831 1.54688 6.07561 1.54688 6.1875V12.9375C1.54688 13.124 1.62095 13.3028 1.75282 13.4347C1.88468 13.5665 2.06352 13.6406 2.25 13.6406C2.43648 13.6406 2.61532 13.5665 2.74718 13.4347C2.87905 13.3028 2.95312 13.124 2.95312 12.9375V4.5C2.95312 4.23893 3.05684 3.98855 3.24144 3.80394C3.42605 3.61934 3.67643 3.51563 3.9375 3.51562H15.1875C15.4486 3.51562 15.699 3.61934 15.8836 3.80394C16.0682 3.98855 16.1719 4.23893 16.1719 4.5ZM15.3281 4.5C15.3281 4.4627 15.3133 4.42694 15.2869 4.40056C15.2606 4.37419 15.2248 4.35938 15.1875 4.35938H3.9375C3.9002 4.35938 3.86444 4.37419 3.83806 4.40056C3.81169 4.42694 3.79688 4.4627 3.79688 4.5V12.9375C3.79718 13.182 3.73908 13.4231 3.62742 13.6406H14.625C14.8115 13.6406 14.9903 13.5665 15.1222 13.4347C15.254 13.3028 15.3281 13.124 15.3281 12.9375V4.5Z",
          "fill":"#343330"
        },
        {
          "id": "17",
          "name": "Delegation Role",
          "url": "/setting/delegationRole/create",
          "icon": "M12.7969 7.875C12.7969 7.98689 12.7524 8.09419 12.6733 8.17331C12.5942 8.25243 12.4869 8.29688 12.375 8.29688H6.75C6.63811 8.29688 6.53081 8.25243 6.45169 8.17331C6.37257 8.09419 6.32812 7.98689 6.32812 7.875C6.32812 7.76311 6.37257 7.65581 6.45169 7.57669C6.53081 7.49757 6.63811 7.45312 6.75 7.45312H12.375C12.4869 7.45312 12.5942 7.49757 12.6733 7.57669C12.7524 7.65581 12.7969 7.76311 12.7969 7.875ZM12.375 9.70312H6.75C6.63811 9.70312 6.53081 9.74757 6.45169 9.82669C6.37257 9.90581 6.32812 10.0131 6.32812 10.125C6.32812 10.2369 6.37257 10.3442 6.45169 10.4233C6.53081 10.5024 6.63811 10.5469 6.75 10.5469H12.375C12.4869 10.5469 12.5942 10.5024 12.6733 10.4233C12.7524 10.3442 12.7969 10.2369 12.7969 10.125C12.7969 10.0131 12.7524 9.90581 12.6733 9.82669C12.5942 9.74757 12.4869 9.70312 12.375 9.70312ZM16.1719 4.5V12.9375C16.1719 13.3478 16.0089 13.7412 15.7188 14.0313C15.4287 14.3214 15.0353 14.4844 14.625 14.4844H2.25C1.84084 14.4844 1.44834 14.3223 1.15843 14.0335C0.868511 13.7448 0.704799 13.353 0.703125 12.9438V6.1875C0.703125 6.07561 0.747572 5.96831 0.826689 5.88919C0.905806 5.81007 1.01311 5.76562 1.125 5.76562C1.23689 5.76562 1.34419 5.81007 1.42331 5.88919C1.50243 5.96831 1.54688 6.07561 1.54688 6.1875V12.9375C1.54688 13.124 1.62095 13.3028 1.75282 13.4347C1.88468 13.5665 2.06352 13.6406 2.25 13.6406C2.43648 13.6406 2.61532 13.5665 2.74718 13.4347C2.87905 13.3028 2.95312 13.124 2.95312 12.9375V4.5C2.95312 4.23893 3.05684 3.98855 3.24144 3.80394C3.42605 3.61934 3.67643 3.51563 3.9375 3.51562H15.1875C15.4486 3.51562 15.699 3.61934 15.8836 3.80394C16.0682 3.98855 16.1719 4.23893 16.1719 4.5ZM15.3281 4.5C15.3281 4.4627 15.3133 4.42694 15.2869 4.40056C15.2606 4.37419 15.2248 4.35938 15.1875 4.35938H3.9375C3.9002 4.35938 3.86444 4.37419 3.83806 4.40056C3.81169 4.42694 3.79688 4.4627 3.79688 4.5V12.9375C3.79718 13.182 3.73908 13.4231 3.62742 13.6406H14.625C14.8115 13.6406 14.9903 13.5665 15.1222 13.4347C15.254 13.3028 15.3281 13.124 15.3281 12.9375V4.5Z",
          "fill":"#343330"
        }
      ]
    }
  ]

  ngOnInit(): void {
  }

  goToPay() {
    this.router.navigate(['/pay']);
  }

  goToDashBoard() {
    this.router.navigate(['/dashboard']);
  }

  // viewPayPages() {
  //   if (this.choosePayPageId == 0) {
  //     this.router.navigate(['/dashboard']);
  //   }
  //   else if (this.choosePayPageId == 1) {
  //     this.router.navigate(['/pay/vendors']);
  //   }
  //   else if (this.choosePayPageId == 2) {
  //     this.router.navigate(['/collect/createCustomer']);
  //   }
  //   else if (this.choosePayPageId == 3) {
  //     this.router.navigate(['/profile/product']);
  //   }
  //   else if (this.choosePayPageId == 4) {
  //     this.router.navigate(['/bills/purchaseOrder']);
  //   }
  //   else if (this.choosePayPageId == 5) {
  //     this.router.navigate(['/collect/purchaseInvoice']);
  //   }
  //   else if (this.choosePayPageId == 6) {
  //     this.router.navigate(['/invoice/salesOrder']);
  //   }
  //   else if (this.choosePayPageId == 7) {
  //     this.router.navigate(['/bills/receiptNote']);
  //   }
  //   else if (this.choosePayPageId == 8) {
  //     this.router.navigate(['/bills/debitNote']);
  //   }
  //   else if (this.choosePayPageId == 9) {
  //     this.router.navigate(['/invoice/creditNote']);
  //   }
  //   else if (this.choosePayPageId == 10) {
  //     this.router.navigate(['/profile/productCateogry']);
  //   }
  //   else if (this.choosePayPageId == 11) {
  //     this.router.navigate(['/invoice/cashMemo']);
  //   }
  //   else if (this.choosePayPageId == 12) {
  //     this.router.navigate(['/profile/beneficiary/create']);
  //   }
  //   else if (this.choosePayPageId == 13) {
  //     this.router.navigate(['/pay/returnAndRefund']);
  //   }
  //   else if (this.choosePayPageId == 14) {
  //     this.router.navigate(['/setting/role/create']);
  //   }
  //   else if (this.choosePayPageId == 15) {
  //     this.router.navigate(['/setting/delegationRole/create']);
  //   }
  //   else if (this.choosePayPageId == 16) {
  //     this.router.navigate(['/invoice/salesInvoice']);
  //   }
  //   else if (this.choosePayPageId == 17) {
  //     this.router.navigate(['/invoice/vendorInvoice']);
  //   }

  // }

}
