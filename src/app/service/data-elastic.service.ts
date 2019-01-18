import {EventEmitter, Injectable, Output} from '@angular/core';
import {Client} from 'elasticsearch-browser';


@Injectable()
export class DataElasticService {

  @Output()
  updateResponseData: EventEmitter<any> = new EventEmitter<any>();
  public host = 'http://k8.asferro.net:30020/';
  public index = 'ang-test-1';
  public type = 'doc';
  public resAddToDB;
  private client: Client;
  private queryalldocs = {
    'size': 1000,
    'query': {
      'match_all': {}
    }
  };

  connect(host, log) {
    try {
      this.client = new Client({
        host: host,
        log: log
      });
    } catch (e) {
      console.log('Could not connect to the database');
    }
  }

  async addDataInDB(value) {
    this.resAddToDB = await this.client.index({
      index: this.index,
      type: this.type,
      body: value
    }).then(
      result => {
        console.log(result);
        if (result.result === 'created') {
          this.sleep(1000).then(() => {
            this.getAllDocuments();
          });
        }
        console.log('User added, see log for more info');
      }, error => {
        console.log('Something went wrong');
        console.error(error);
      });
  }

  async getAllDocuments() {
    try {
      let res = await this.client.search({
        index: this.index,
        type: this.type,
        body: this.queryalldocs,
        filterPath: ['hits.hits']
      });
      this.updateResponseData.emit(res);
      console.log(res);
      console.log(res.hits.hits);

    } catch (e) {
      console.log('failed to get information ' + e);
    }
  }

  async removeUser(id) {
    console.log('click remove user: ' + id);
    await this.client.bulk({
      body: [
        {delete: {_index: this.index, _type: this.type, _id: id}},
      ]
    }, (err, resp) => {
      console.log(resp.items);
      this.sleep(800).then(() => {
        this.getAllDocuments();
      });
    });
  }

  async updateDataInDB(id, value){
    console.log(value);

    await this.client.index({
      index: this.index,
      type: this.type,
      id: id,
      body: value
    }, (err, resp) => {
      console.log(resp);
      this.sleep(1000).then(() => {
        this.getAllDocuments();
      });
    });
  }

  private sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
