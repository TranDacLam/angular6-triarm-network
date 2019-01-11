import {Injectable} from '@angular/core';
import {ApiService} from './api.service';

// import {api} from '../constant/api';

@Injectable({
  providedIn: 'root'
})
export class NewsService {


  constructor(private apiService: ApiService) {
  }

  async getLastedNews() {
    const data = {
      name: 'get_lasted_news',
      params: {
      }
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async getNewsDetail(newsId) {
    const data = {
      name: 'get_news_by_id',
      params: {
        _id: newsId
      }
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async getAllNews() {
    const data = {
      name: 'get_all_news',
      params: {}
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async deleteNews(newsId) {
    const data = {
      name: 'delete_news',
      params: {
        _id: newsId
      }
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
  
  async sendNewsToSubscriber(newsId) {
    const data = {
      name: 'send_news_to_subscriber',
      params: {
        newsId: newsId
      }
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async postNews(data_params) {
    const data = {
      name: 'post_news',
      params: data_params
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }

  async editNews(data_params) {
    const data = {
      name: 'edit_news',
      params: data_params
    };
    const result = await this.apiService.postJSON(data);
    return result;
  }
}
