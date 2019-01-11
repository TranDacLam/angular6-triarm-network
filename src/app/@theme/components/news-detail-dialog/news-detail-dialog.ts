import {Component, OnInit, Input, OnChanges} from '@angular/core';
import { NewsService } from '../../../@core/services/news.service';

@Component({
    selector: 'app-news-detail-dialog',
    templateUrl: './news-detail-dialog.html',
    styleUrls: ['./news-detail-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class NewsDetailDialog implements OnInit, OnChanges {

    @Input() id_news_detail: number;

    news_detail: any = null;
    news_createdBy: any = null;

    constructor(
        private newsService: NewsService,
    ) {
    }

    ngOnInit() {}

    ngOnChanges() {
        if (this.id_news_detail) {
            this.getNewsDetail(this.id_news_detail);
        }
    }

    async getNewsDetail(news_id) {
        const response = await this.newsService.getNewsDetail(news_id);
        if(!response.success){
            return;
        }
        this.news_detail = response.result.news;
        this.news_createdBy = response.result.createdBy;
    }

}
