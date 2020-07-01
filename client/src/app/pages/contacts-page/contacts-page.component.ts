import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactModuleComponent } from 'src/app/modules/contact-module/contact-module.component';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from 'src/app/interfaces';
import { Subscription } from 'rxjs';
import { ContactService } from 'src/app/services/contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.component.html',
  styleUrls: ['./contacts-page.component.scss']
})
export class ContactsPageComponent implements OnInit, OnDestroy {

  panelOpenState = false;

  oSub: Subscription

  constructor(
    public dialog: MatDialog,
    public contactService: ContactService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.oSub = this.contactService.get().subscribe(contacts => {
      this.contactService.array = contacts
    })
  }

  openModal(type = 'create', contact: Contact = null): void {
    this.dialog.open(ContactModuleComponent, {
      width: '600px',
      data: { type, contact }
    });
  }

  onDelete(contact: Contact): void {
    if(!confirm('Удалить контакт?')) return
    
    this.oSub = this.contactService.delete(contact.id).subscribe(() => {
      const idx = this.contactService.array.findIndex(el => el.id === contact.id)
      this.contactService.array.splice(idx, 1)
      this.snackBar.open('Контакт успешно удален')
    })
  }

  ngOnDestroy() {
    if (this.oSub) this.oSub.unsubscribe()
  }
}
