document.addEventListener('deviceready', loadContacts, false);

function loadContacts() {
    let options = new ContactFindOptions();
    //options.filter = "resp";
    options.multiple = true;
    options.hasPhoneNumber = true;

    let fields = ['name']; 

    navigator.contacts.find(fields, showContacts, handleContactError, options);
}

function showContacts(contacts) {
   
    let contactItem;
    const contactList = document.getElementById('contactList');
    $(contactList).listview('refresh');

    for (const contact of contacts) {
        contactItem = document.createElement('li');
        contactItem.innerHTML = `
            <a href="#contact-show">
                <img src="img/avatarStandard.png">
                <h1>${contact.name.formatted}</h1>
                <p>${contact.phoneNumbers[0].value}</p>
            </a>
        `;
        contactItem.onclick = function () {
            getContact(contact.id)
        }
        contactList.appendChild(contactItem);
    }
    // console.log(contacts);
    // alert(`${contacts.length} contacts found`);

    // const contactList = document.getElementById('contactList');
    // contactList.innerHTML = contactHTML;
    $(contactList).listview('refresh');

}

function getContact(contactId) {
    let options = new ContactFindOptions();
    options.filter = contactId;
    options.multiple = false;

    let fields = ['id']; 

    navigator.contacts.find(fields, showContact, handleContactError, options);
}

function showContact(contacts) {

    const contact = contacts[0];
    let contactInfos = `
    <li>
        <img src="img/avatarStandard.png">
        <h1>Nom du contact</h1>
        <p>${contact.name.formatted}</p>
    </li>
    <li>
        <h1>Téléphone</h1>
        <p>${contact.phoneNumbers[0].value}</p>
    </li>
    <li>
        <h1>Email</h1>
        <p>${contact.emails ? contact.emails[0].value : 'Non renseigné'}</p>
    </li>
    <li>
        <h1>Adresse</h1>
        <p>${contact.adresses ? contact.adresses[0].formatted : 'Non renseigné'}</p>
    </li>
    <li>
        <h1>Organisation</h1>
        <p>${contact.organizations ? contact.organizations[0].name : 'Non renseigné'}</p>
    </li>`;

    const contactDetail = document.getElementById('contactDetail');
    contactDetail.innerHTML = contactInfos;
    $(contactDetail).listview('refresh');

    const deleteButton = document.getElementById("delete");
    deleteButton.addEventListener("click", function () {
    deleteContact(contact.id);
  });
}
//suppression 
function deleteContact(contactId) {
    if (confirm("Voulez-vous supprimer ce contact?")) {
        let contact = navigator.contacts.create();
        contact.id = contactId;

        contact.remove(function(contact) {

            console.log("Contact removed succefully!!", contact);

        }, function(error) {
            console.error("Error while removing contact: ", error);
        });
    }
  }
function handleContactError(error) {
    console.log("Error while getting contacts list");
    console.log(error);
}

// Ajout d'un contact
function addContact() {

    let newContact = navigator.contacts.create();
    newContact.displayName = document.getElementById('newFirstName').value + ' ' + document.getElementById('newLastName').value;
    console.log(newContact.displayName);

    let phoneNumbers = [];
    phoneNumbers[0] = new ContactField('mobile', document.getElementById('newPhoneNumber').value, true);
    newContact.phoneNumbers = phoneNumbers;
    console.log(newContact.phoneNumbers);

    let emails = [];
    emails[0] = new ContactField('work', document.getElementById('newEmail').value, true);
    newContact.emails = emails;

    let addresses = [];
    addresses[0] = new ContactAddress('', '', '', document.getElementById('newAddress').value, '', '');
    newContact.addresses = addresses;

    let organizations = [];
    organizations[0] = new ContactOrganization(true, '', document.getElementById('newOrganization').value, '');
    newContact.organizations = organizations;

    
    newContact.save(function(contact) {

        console.log("Contact saved succefully!!", contact);

    }, function(error) {
        console.error("Error while saving contact: ", error);
    });
};



// function addSuccess(contact) {
//     console.log("Contact saved succefully!!", contact);

//     showContact(contact);
// }

// function addError(error) {
//     // Une erreur est survenue lors de l'ajout du contact
//     console.error("Error while saving contact: ", error);
// }

// Récupération du contact à modifier et pré-remplissage du formulaire
function editContact(contactId) {
    let options = new ContactFindOptions();
    options.filter = contactId;
    options.multiple = false;

    let fields = ['id', 'displayName', 'name', 'phoneNumbers', 'emails', 'addresses', 'organizations'];

    navigator.contacts.find(fields, showEditContact, handleContactError, options);
}

function showEditContact(contacts) {
    const contact = contacts[0];

    // Pré-remplir le formulaire avec les détails du contact
    document.getElementById('editFirstName').value = contact.name.givenName || '';
    document.getElementById('editLastName').value = contact.name.familyName || '';

    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        document.getElementById('editPhoneNumber').value = contact.phoneNumbers[0].value || '';
    }

    if (contact.emails && contact.emails.length > 0) {
        document.getElementById('editEmail').value = contact.emails[0].value || '';
    }

    if (contact.addresses && contact.addresses.length > 0) {
        document.getElementById('editAddress').value = contact.addresses[0].formatted || '';
    }

    if (contact.organizations && contact.organizations.length > 0) {
        document.getElementById('editOrganization').value = contact.organizations[0].name || '';
    }

    // Mettre à jour le contact après modification
    document.getElementById('editContactForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le rechargement de la page

        contact.name.givenName = document.getElementById('editFirstName').value;
        contact.name.familyName = document.getElementById('editLastName').value;

        contact.phoneNumbers = [new ContactField('mobile', document.getElementById('editPhoneNumber').value, true)];
        contact.emails = [new ContactField('work', document.getElementById('editEmail').value, true)];
        contact.addresses = [new ContactAddress('', '', '', document.getElementById('editAddress').value, '', '')];
        contact.organizations = [new ContactOrganization(true, '', document.getElementById('editOrganization').value, '')];

        contact.save(function(contact) {

            console.log("Contact modified succefully!!", contact);
    
        }, function(error) {
            console.error("Error while modifying contact: ", error);
        });
    });
}

