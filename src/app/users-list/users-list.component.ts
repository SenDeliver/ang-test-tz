import { Component, OnInit, EventEmitter } from '@angular/core';
import {DataElasticService} from '../service/data-elastic.service';
import {Client} from 'elasticsearch-browser';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  changeForm: FormGroup;
  submitted = false;
  private showModalForm = false;
  private id;
  constructor(private dataElastic: DataElasticService, private fb: FormBuilder) { }

  public responseData;

  ngOnInit() {
    this.dataElastic.updateResponseData.subscribe(userList => {
      this.responseData = userList;
    });
    this.dataElastic.getAllDocuments();
  }

  private changeUserData(id, firstName, surName, dateOfBirthday, phoneNumber, email){
    console.log('click change user: ' + id);
    this.id = id;
    this.showModalForm = true;
    this.changeForm = this.fb.group({
      name: this.fb.group({
        firstName: this.fb.control(firstName,
          [
            Validators.required,
            Validators.pattern(/^[А-яA-z]*$/),
            Validators.minLength(3)]),
        surName: this.fb.control(surName,
          [
            Validators.required,
            Validators.pattern(/^[А-яA-z]*$/),
            Validators.minLength(3)])
      }),
      dateOfBirthday: this.fb.control(dateOfBirthday,
        [
          Validators.required,
          this.validateDate]),
      phoneNumber: this.fb.control(phoneNumber,
        [
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
          Validators.minLength(11)]),
      email: this.fb.control( email,
        [
          Validators.required,
          Validators.email])
    });
  }private validateDate(control: FormControl) {
    const currentDate = new Date(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
    const userDate = new Date(control.value);
    if (userDate > currentDate) {
      return {incorrectdate: 'Incorrect Date Of Birthday'};
    }
  }

  async saveChange(){
    console.log('Click save change');
    this.submitted = true;
    if (this.changeForm.invalid) {
      return;
    }
    try {
      await this.dataElastic.updateDataInDB(this.id, this.changeForm.value);
    }catch (e) {
      throw new Error('failed to write to database ' + e);
    }
    this.closeModal();
  }
  public closeModal(){
    this.showModalForm = false;
  }

  getFormField = () => this.changeForm.controls;

  private isObject(obj){
    if (typeof obj === 'object'){
      return true;
    } return false;
  }

  removeUser(id){
    this.dataElastic.removeUser(id);
  }
}
