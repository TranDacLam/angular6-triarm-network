import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { NewsService } from '../../../@core/services/news.service';
import { TranslatePipe } from './../../pipes/translate.pipe';

declare var $: any;
declare var CKEDITOR: any;

@Component({
    selector: 'app-news-dialog',
    templateUrl: './news-dialog.html',
    styleUrls: ['./news-dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class NewsDialog implements OnInit, OnChanges {

    @Input() news_detail: any;
    @Output() onNews = new EventEmitter();

    title: string = '';
    content: string = '';
    heading: string = '';

    constructor(
        private newsService: NewsService,
        private t: TranslatePipe
    ) {
    }

    ngOnInit() {
    }

    checkRequired(){
        let valueContent = CKEDITOR.instances.editor1.document.getBody().getChild(0).getText();
        if(valueContent.trim() === ''){
            this.content = '';
        }
    }

    ngOnChanges() {
        if(this.news_detail){
            this.heading = this.t.transform('edit_news');
            this.title = this.news_detail.title;
            this.content = this.news_detail.content;
        }else{
            this.heading = this.t.transform('create_news');
            this.title = '';
            this.content = '';
        }
    }

    OK(){
        $('#newsModal').modal('hide');
        let news = {...this.news_detail};
        news.title= this.title;
        news.content= this.content;
        this.onNews.emit(news);
        this.title = '';
        this.content = '';
    }

}
