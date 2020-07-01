import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contact } from 'src/app/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from 'src/app/services/contact.service';

interface DialogData {
  type: string
  contact?: Contact
}

@Component({
  selector: 'app-contact-module',
  templateUrl: './contact-module.component.html',
  styleUrls: ['./contact-module.component.scss']
})
export class ContactModuleComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<ContactModuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private snackBar: MatSnackBar,
    private contactService: ContactService
  ) { }

  form: FormGroup

  oSub: Subscription

  ngOnInit(): void {
  
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      phone: new FormControl(null, [Validators.required, Validators.minLength(15), Validators.maxLength(15)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      address: new FormControl(null, Validators.required)
    })

    if (this.data.type === 'edit') {
      this.form.patchValue({
        name: this.data.contact.name,
        phone: this.data.contact.phone,
        email: this.data.contact.email,
        address: this.data.contact.address
      })
    }
  }

  onSubmit() {
    this.form.disable()
    
    if (this.data.type === 'create') {
      this.onCreate()
    } else if (this.data.type === 'edit') {
      this.onEdit()
    }
  }

  onCreate() {
    const contact: Contact = {
      name: this.form.get('name').value.trim(),
      phone: this.form.get('phone').value.trim(),
      email: this.form.get('email').value.trim(),
      address: this.form.get('address').value.trim(),
    }
    this.oSub = this.contactService.create(contact).subscribe(item => {
      this.snackBar.open('Контакт успешно добавлен')
      this.contactService.array.push(item)
      this.dialogRef.close()
      this.form.enable()
    })
  }

  onEdit() {
    const contact: Contact = {
      id: this.data.contact.id,
      name: this.form.get('name').value.trim(),
      phone: this.form.get('phone').value.trim(),
      email: this.form.get('email').value.trim(),
      address: this.form.get('address').value.trim(),
    }
    this.oSub = this.contactService.patch(contact).subscribe(item => {
      this.snackBar.open('Контакт успешно изменен')
      
      const candidate = this.contactService.array.find(el => el.id === item.id)

      if (candidate) {
        candidate.name = item.name
        candidate.phone = item.phone
        candidate.email = item.email
        candidate.address = item.address
      }

      this.dialogRef.close()
      this.form.enable()
    })
  }

  ngOnDestroy() {
    if (this.oSub) this.oSub.unsubscribe()
  }
}
