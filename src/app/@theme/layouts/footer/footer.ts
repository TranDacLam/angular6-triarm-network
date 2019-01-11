import {Component, OnInit} from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-footer',
    templateUrl: './footer.html',
    styleUrls: ['./footer.scss']
})

// tslint:disable-next-line:component-class-suffix
export class Footer implements OnInit {

    constructor(
    ) {
    }

    ngOnInit() {
        $(document).ready(function() {
            $('.tab-item').removeClass('active');
            const path = location.pathname.split('/');
            if (path[1] === 'wallet' && path[2] !== 'settings' && path[2] !== 'advance_transaction') {
                $('#wallet-mobile').addClass('active');
            }
            if (path[1] === 'admin') {
                $('#admin').addClass('active');
            }
            if (path[2] === 'advance_transaction') {
                $('#notify').addClass('active');
            }
            if (path[2] === 'settings') {
                $('#setting').addClass('active');
            }
        });
    }

}
