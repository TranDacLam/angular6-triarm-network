import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from './../../../@core/services/news.service';
import { TranslatePipe } from './../../../@theme/pipes/translate.pipe';
import { errors } from './../../../@core/common/error-code';
import swal from 'sweetalert2';

declare var $: any;

@Component({
    templateUrl: './news.html',
    styleUrls: ['./news.scss']
})

export class NewsComponent implements OnInit {

	limit: number = 10;
	currentPage: number = 1;
	waitTableData: boolean = false;
	editing: any = {};
	deleting: any = {};
	sending: any = {};
	sentId: Array<any> = [];
	allNews: Array<any> = [];
	currentItems: Array<any> = [];
	timeInterval: any = null;
	news_detail: any = null;

	msg_alert: string = '';

    constructor(
    	private newsService: NewsService,
    	private t: TranslatePipe,
    	private router: Router
    ) {}

    ngOnInit() {
    	this.getAllNews();
    }

    async getAllNews(){
    	let response = await this.newsService.getAllNews();
    	if(!response.success){
    		return;
    	}
    	this.allNews = response.result;
    	this.currentItems = this.allNews.slice(0, this.limit);
    }

    newsDialog(news){
    	$('#newsModal').modal('show');
    	if(news){
    		this.news_detail = news;
    	}else{
    		this.news_detail = null;
    	}
    }

    pageChanged(event){
        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.currentPage = event.page;
        this.currentItems = this.allNews.slice(startItem, endItem);
    }

    deleteNews(newsId) {
    	swal({
            title: this.t.transform('confirm_'),
            text: this.t.transform('delete_news'),
            showCancelButton: true,
            confirmButtonText: this.t.transform('yes_delete_'),
            cancelButtonText: this.t.transform('cancel_'),
            confirmButtonColor: '#4018AC',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
            	this.deleting[newsId] = true;
                this.newsService.deleteNews(newsId).then(
                    (data) => {
                    	this.deleting[newsId] = false;
                    	if(!data.success){
                            swal(
                                this.t.transform('CANT_DELETE_BACKUP_FILE'),
                                '',
                                'error'
                            );
                    		return;
                    	}
                    	let indexOfFileDeleted = this.allNews.findIndex((news) => {
							return news._id === newsId;
						});
						this.allNews.splice(indexOfFileDeleted, 1);
						this.currentItems = this.allNews.slice(0, 10);
						this.msg_alert = this.t.transform('delete_news_success');
                    }
                )
            }
        });
	};

	sendNews(newsId) {
		swal({
            title: this.t.transform('confirm_'),
            text: this.t.transform('send_news'),
            showCancelButton: true,
            confirmButtonText: this.t.transform('yes_send'),
            cancelButtonText: this.t.transform('cancel_'),
            confirmButtonColor: '#4018AC',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
            	this.sending[newsId] = true;
                this.newsService.sendNewsToSubscriber(newsId).then(
                    (data) => {
                    	if(!data.success){
                    		swal(
                                this.t.transform('CANT_SEND_NEWS'),
                                '',
                                'error'
                            );
                            return;
                    	}
                    	this.sentId.push(newsId);
                        this.sending[newsId] = false;
                        this.msg_alert = this.t.transform('send_news_success');
                    }
                )
            }
        });
    };

    async onNewsChange(event){
    	if(this.news_detail){
    		let response = await this.newsService.editNews(event);
    		if(!response.success){
                swal(
                    this.t.transform(errors[response.error.errorCode]),
                    '',
                    'error'
                );
    			return;
    		}
    		var indexOfFileDeleted = this.allNews.findIndex((news) => {
				return news._id === event._id;
			});
			this.allNews[indexOfFileDeleted] = response.result;
			this.msg_alert = this.t.transform('update_news_success');
    	}else{
    		let response = await this.newsService.postNews(event);
    		if(!response.success){
                swal(
                    this.t.transform(errors[response.error.errorCode]),
                    '',
                    'error'
                );
    			return;
    		}
			this.allNews.unshift(response.result);
			this.msg_alert = this.t.transform('create_news_success');
    	}
    	this.currentItems = this.allNews.slice(0, this.limit);
    }

}
