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
  getItem: string;
  filterData: Array<IContact> = []
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
      name: [null, Validators.pattern(/[^0-9@.\/><*{\[\]?^+]+/)],
      surname: [null, Validators.pattern(/[^0-9@.\/><*{\[\]?^+]+/)],
      phone: [null, Validators.pattern(/[^a-zA-Z@.\/><*{\[\]?^+]+/)],
      dataOfBirth: [null, Validators.pattern(/[^a-zA-Z\/><*{\[\]?^+]+/)],
      email: [null, Validators.pattern(/[a-zA-Z0-9\.]{4,}@\w{3,}.\w{3,}/)],
      address: [null, Validators.pattern(/[^0-9@.\/><*{\[\]?^+]+/)],
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
    if (this.ContactForm.value.name != '' && this.ContactForm.value.surname != '' && this.ContactForm.value.phone != '' && this.ContactForm.value.dataOfBirth != '' && this.ContactForm.value.email != '' && this.ContactForm.value.address != '' && this.ContactForm.value.country != null) {
      const newContact = {
        name: this.ContactForm.value.name,
        surname: this.ContactForm.value.surname,
        phone: this.ContactForm.value.phone,
        dataOfBirth: this.ContactForm.value.dataOfBirth,
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
      this.error('Please , fill your fields')
    }

  }
  getInfo(item, i): void {
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
      name: [null, Validators.pattern(/[^0-9@.\/><*{\[\]?^+]+/)],
      surname: [null, Validators.pattern(/[^0-9@.\/><*{\[\]?^+]+/)],
      phone: [null, Validators.pattern(/[^a-zA-Z@.\/><*{\[\]?^+]+/)],
      dataOfBirth: [null, Validators.pattern(/[^a-zA-Z\/><*{\[\]?^+]+/)],
      email: [null, Validators.pattern(/[a-zA-Z0-9\.]{4,}@\w{3,}.\w{3,}/)],
      address: [null, Validators.pattern(/[^0-9@.\/><*{\[\]?^+]+/)],
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
      dataOfBirth: item.dataOfBirth,
      email: item.email,
      address: item.address,
      country: item.country,
    })
  }
  closeEdit(): void {
    this.isShowEdit = false
  }
  saveEdit(): void {
    if (this.editForm.value.name != '' && this.editForm.value.surname != '' && this.editForm.value.phone != '' && this.editForm.value.dataOfBirth != '' && this.editForm.value.email != '' && this.editForm.value.address != '' && this.editForm.value.country != null) {
      const editContact = {
        name: this.editForm.value.name,
        surname: this.editForm.value.surname,
        phone: this.editForm.value.phone,
        dataOfBirth: this.editForm.value.dataOfBirth,
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
      this.error('Please , fill your fields')
    }

  }
  searchItem(): void {
    let deleteSpaces = this.getItem.replace(/\s{2,}/g, "")
    this.actionContacts.filter(item => {
      if (item.phone == deleteSpaces || item.name == deleteSpaces || item.surname == deleteSpaces || item.email == deleteSpaces) {
        if(!this.filterData.includes(item)){
          this.filterData.push(item)
        }
        this.switchSearch = false
        this.getItem = ''
      }
    })

  }
  editContactSearch(item, index): void {
    this.infoIndex = this.actionContacts.indexOf(item)
    this.isShowEdit = true
    this.editForm.patchValue({
      name: item.name,
      surname: item.surname,
      phone: item.phone,
      dataOfBirth: item.dataOfBirth,
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
        dataOfBirth: this.editForm.value.dataOfBirth,
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
