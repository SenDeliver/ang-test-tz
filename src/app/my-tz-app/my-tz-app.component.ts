import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {formatDate} from '@angular/common';
import {DataElasticService} from '../service/data-elastic.service';

@Component({
  selector: 'app-my-tz-app',
  templateUrl: './my-tz-app.component.html',
  styleUrls: ['./my-tz-app.component.css']
})
export class MyTzAppComponent implements OnInit {
  addedForm: FormGroup;
  submitted = false;

  placeholderFirstName = 'Иван';
  placeholderSurName = ' Иванов';
  placeholderDateOfBirthday = '01.12.1989';
  placeholderPhoneNumber = ' 380985536784';
  placeholderEmail = ' user@site.com';

  constructor(private fb: FormBuilder, private dataElastic: DataElasticService) {
  }

  getFormField = () => this.addedForm.controls;

  ngOnInit() {
    try {
      this.dataElastic.connect(this.dataElastic.host, 'info');
    }catch (e) {
      throw new Error('No connection to base' + e);
    }

    this.addedForm = this.fb.group({
      _name: this.fb.group({
        _firstName: this.fb.control('',
          [
            Validators.required,
            Validators.pattern(/^[А-яA-z]*$/),
            Validators.minLength(3)]),
        _surName: this.fb.control('',
          [
            Validators.required,
            Validators.pattern(/^[А-яA-z]*$/),
            Validators.minLength(3)])
      }),
      _dateOfBirthday: this.fb.control('',
        [
          Validators.required,
          this.validateDate]),
      _phoneNumber: this.fb.control('',
        [
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
          Validators.minLength(11)]),
      _email: this.fb.control( '',
        [
          Validators.required,
          Validators.email])
    });
  }
  private validateDate(control: FormControl) {
    const currentDate = new Date(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
    const userDate = new Date(control.value);
    if (userDate > currentDate) {
      return {incorrectdate: 'Incorrect Date Of Birthday'};
    }
  }

  async save() {
    this.submitted = true;

    if (this.addedForm.invalid) {
      return;
    }
    try {
      await this.dataElastic.addDataInDB(this.addedForm.value);
    }catch (e) {
      throw new Error('failed to write to database ' + e);
    }
    // alert('Success added to DB');
  }
}
