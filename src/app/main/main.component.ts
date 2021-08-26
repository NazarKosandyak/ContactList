import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IContact } from '../interfaces/user.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isShow: boolean = false;
  isShowInfo: boolean = false;
  isShowEdit: boolean = false;
  switchSearch: boolean = true
  currentContact: IContact;
  ContactForm: FormGroup;
  editForm: FormGroup;
  actionContacts: Array<IContact> = [];
  index: number;
  seacrhIndex: Array<number>;
  infoIndex: number
  getItem: string = '';
  filterData: Array<IContact> = []
  RegexForName = /^[a-zA-Z ,.'-]+$/
  RegexForSurName = /^[a-zA-Z ,.'-]+$/
  RegexForPhone = /^[0-9]{2,}.?\s?[0-9]{2,}.?\s?[0-9]{2,}\s?$/
  RegexForDateOfBirth = /^[0-9]{2}-*\.*[0-9]{2}-*\.*[0-9]{2,4}$/
  RegexForEmail = /^\w{3,}@[a-zA-Z]{3,}\.{1}[a-z]{2,10}$/
  RegexForAddress = /^[a-zA-Z]{3,}\s*[0-9]*\s*$/
  constructor(
    private FormBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initContactForm()
    this.initEditForm()
    if (JSON.parse(localStorage.getItem('contacts')) == null) {
      let setDefault = [
        { name: 'Petro', surname: 'Petriv', phone: '0685810236', dataOfBirth: '03.03.2002', email: 'petriv@gmail.com', address: 'Lviv : 79071', country: 'Ukraine' },
        { name: 'Bogdan', surname: 'Antonin', phone: '0503024039', dataOfBirth: '26.09.1993', email: 'antonin@gmail.com', address: 'Varshava : 43435', country: 'Poland' },
        { name: 'Volodymyr', surname: 'Velohin', phone: '0637325610', dataOfBirth: '14.05.1999', email: 'afanasiy123@gmail.com', address: 'Lviv : 79001', country: 'Ukraine' }
      ]
      localStorage.setItem('contacts', JSON.stringify(setDefault))
    }

    this.actionContacts = JSON.parse(localStorage.getItem('contacts'))
    localStorage.setItem('contacts', JSON.stringify(this.actionContacts))


  }
  initContactForm(): void {
    this.ContactForm = this.FormBuilder.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      phone: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      email: [null, Validators.required],
      address: [null, Validators.required],
      country: [null, Validators.required]
    })
  }
  newContact(): void {
    this.isShow = true
  }
  closeNew(): void {
    this.isShow = false
  }
  submitContact(): void {
    const checkRegexName = this.RegexForName.exec(this.ContactForm.value.name)
    const checkRegexSurname = this.RegexForSurName.exec(this.ContactForm.value.surname)
    const checkRegexPhone = this.RegexForPhone.exec(this.ContactForm.value.phone)
    const checkRegexDateOfBirth = this.RegexForDateOfBirth.exec(this.ContactForm.value.dateOfBirth)
    const checkRegexEmail = this.RegexForEmail.exec(this.ContactForm.value.email)
    const checkRegexAddress = this.RegexForAddress.exec(this.ContactForm.value.address)
    if (checkRegexName != null && checkRegexSurname != null && checkRegexPhone != null && checkRegexDateOfBirth != null && checkRegexEmail != null && checkRegexAddress != null && this.ContactForm.value.country != null) {
      const newContact = {
        name: this.ContactForm.value.name,
        surname: this.ContactForm.value.surname,
        phone: this.ContactForm.value.phone,
        dateOfBirth: this.ContactForm.value.dateOfBirth,
        email: this.ContactForm.value.email,
        address: this.ContactForm.value.address,
        country: this.ContactForm.value.country,
      }
      this.ContactForm.reset()
      this.isShow = false
      this.actionContacts.push(newContact)
      localStorage.setItem('contacts', JSON.stringify(this.actionContacts))
      this.actionContacts = JSON.parse(localStorage.getItem('contacts'))
      this.success('Successfully added')
    }
    else {
      this.error('Please , fill your fields correctly')
    }

  }
  getInfo(item): void {
    this.currentContact = item
    this.isShowInfo = true
  }
  closeInfo(): void {
    this.isShowInfo = false
  }
  deleteContact(index): void {
    this.actionContacts.splice(index, 1)
    localStorage.setItem('contacts', JSON.stringify(this.actionContacts))
    this.filterData = []
    this.success('Successfully deleted')
  }
  initEditForm(): void {
    this.editForm = this.FormBuilder.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      phone: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      email: [null, Validators.required],
      address: [null, Validators.required],
      country: [null, Validators.required]
    })
  }
  editContact(item, index): void {
    this.isShowEdit = true
    this.index = index
    this.editForm.patchValue({
      name: item.name,
      surname: item.surname,
      phone: item.phone,
      dateOfBirth: item.dateOfBirth,
      email: item.email,
      address: item.address,
      country: item.country,
    })
  }
  closeEdit(): void {
    this.isShowEdit = false
  }
  saveEdit(): void {
    const checkRegexName = this.RegexForName.exec(this.editForm.value.name)
    const checkRegexSurname = this.RegexForSurName.exec(this.editForm.value.surname)
    const checkRegexPhone = this.RegexForPhone.exec(this.editForm.value.phone)
    const checkRegexDateOfBirth = this.RegexForDateOfBirth.exec(this.editForm.value.dateOfBirth)
    const checkRegexEmail = this.RegexForEmail.exec(this.editForm.value.email)
    const checkRegexAddress = this.RegexForAddress.exec(this.editForm.value.address)
    if (checkRegexName != null && checkRegexSurname != null && checkRegexPhone != null && checkRegexDateOfBirth != null && checkRegexEmail != null && checkRegexAddress != null && this.editForm.value.country != null) {
      const editContact = {
        name: this.editForm.value.name,
        surname: this.editForm.value.surname,
        phone: this.editForm.value.phone,
        dateOfBirth: this.editForm.value.dateOfBirth,
        email: this.editForm.value.email,
        address: this.editForm.value.address,
        country: this.editForm.value.country,
      }
      this.actionContacts.splice(this.index, 1, editContact)
      localStorage.setItem('contacts', JSON.stringify(this.actionContacts))
      this.isShowEdit = false
      this.switchSearch = true
      this.editForm.reset()
      this.filterData = []
      this.success('Successfully edited')
    }
    else {
      this.error('Please , fill your fields correctly')
    }

  }
  searchItem(): void {
    let getValues = []
    this.getItem = this.getItem.toLowerCase()
    for (const iterator of this.actionContacts) {
      for (const key in iterator) {
        getValues.push(iterator[key])
      }
    }
    let deleteSpaces = this.getItem.replace(/\s{2,}/g, "")
    getValues = getValues.map(value => {
      return value.toLowerCase()
    })
    this.actionContacts.filter(item => {
      if (getValues.includes(this.getItem)) {
        for (const key in item) {
          if (item[key].toLowerCase() == deleteSpaces) {
            this.filterData.push(item)
            this.switchSearch = false
          } 
        } 
      }
    })
    if(!getValues.includes(this.getItem)){
      this.error('No such value')
    }
    this.getItem = ''
  }
  editContactSearch(item): void {
    this.infoIndex = this.actionContacts.indexOf(item)
    this.isShowEdit = true
    this.editForm.patchValue({
      name: item.name,
      surname: item.surname,
      phone: item.phone,
      dateOfBirth: item.dateOfBirth,
      email: item.email,
      address: item.address,
      country: item.country,
    })

  }
  saveDetailtEdit(): void {
    if (this.editForm.value.name != '' && this.editForm.value.surname != '' && this.editForm.value.phone != '' && this.editForm.value.dataOfBirth != '' && this.editForm.value.email != '' && this.editForm.value.address != '' && this.editForm.value.country != null) {
      const editDetails = {
        name: this.editForm.value.name,
        surname: this.editForm.value.surname,
        phone: this.editForm.value.phone,
        dateOfBirth: this.editForm.value.dateOfBirth,
        email: this.editForm.value.email,
        address: this.editForm.value.address,
        country: this.editForm.value.country,
      }
      this.actionContacts.splice(this.infoIndex, 1, editDetails)
      localStorage.setItem('contacts', JSON.stringify(this.actionContacts))
      this.isShowEdit = false
      this.switchSearch = true
      this.editForm.reset()
      this.filterData = []
      this.success('Successfully edited')
    }
  }
  deleteDetailsontact(item): void {
    this.infoIndex = this.actionContacts.indexOf(item)
    this.actionContacts.splice(this.infoIndex, 1)
    localStorage.setItem('contacts', JSON.stringify(this.actionContacts))
    this.switchSearch = true
    this.filterData = []
    this.success('Successfully deleted')
  }
  getBack(): void {
    this.switchSearch = true
    this.filterData = []
  }
  success(messege): void {
    this.toastr.success(messege)
  }
  error(messege): void {
    this.toastr.error(messege)
  }
}
