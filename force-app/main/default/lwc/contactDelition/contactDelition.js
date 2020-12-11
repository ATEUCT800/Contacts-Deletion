import { LightningElement, wire , track} from 'lwc';
import TITLE_FIELD from '@salesforce/schema/Contact.Title'
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import DEPARTMENT_FIELD from '@salesforce/schema/Contact.Department';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import contactDelition from '@salesforce/apex/ContactController.contactDelition';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
const COLUMNS = [
    { label: 'First Name', fieldName: FIRSTNAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Last Name', fieldName: LASTNAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Email', fieldName: EMAIL_FIELD.fieldApiName, type: 'text' },
    { label: 'Title', fieldName: TITLE_FIELD.fieldApiName, type: 'text' },
    { label: 'Department', fieldName: DEPARTMENT_FIELD.fieldApiName, type: 'text' }
];
export default class ContactDelition extends LightningElement {
    columns = COLUMNS;
    
    @track contacts;
    @wire(getContacts)
    wiredContacts(response) {
        this.wiredContactResult = response;
        this.contacts = response.data;
        
    }
    getSelected(){
        let el = this.template.querySelector('lightning-datatable');
        let selected = el.getSelectedRows();
        return selected
    }
    deleteContacts(){
        let ContactsForDelition = this.getSelected();
        let ContactsForDelitionID = [];
        ContactsForDelition.forEach(element => {
            ContactsForDelitionID.push(element.Id);
        });
        contactDelition({
            ids: ContactsForDelitionID
        }).then(result => {
            this.contacts = null;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Contacts successfully deleted!',
                    message: result,
                    variant: 'success',
                }),
            );
            return refreshApex(this.wiredContactResult);
        });
    }
}
