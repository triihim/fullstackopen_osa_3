import React, { useState, useEffect } from 'react';
import contactService from "./services/contactService";
import {ContactFilter, ContactForm, ContactList} from "./components/contact";
import {NotificationType, Notification} from "./components/notification";

const App = () => {
  const [ contacts, setContacts] = useState([]);
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');
  const [ notification, setNotification] = useState({isShown: false});

  const NOTIFICATION_DURATION_S = 3;

  const nameAlreadyExists = () => !!contacts.find(p => p.name.toLowerCase() === newName.toLowerCase());
  const nameIsProvided = () => !!newName && newName.length > 0;
  const numberIsValid = () => !!newNumber && newNumber.length > 6; // Mock constraint.
  const sortContactsByName = (c1, c2) => c2.name.toLowerCase() < c1.name.toLowerCase() ? 1 : -1;

  const clearInputs = () => {
    setNewName("");
    setNewNumber("");
  }

  const showNotification = (type, message) => {
    setNotification({...notification, isShown: true, type: type, message: message});
    setTimeout(() => setNotification({...notification, isShown: false}), NOTIFICATION_DURATION_S * 1000)
  }

  useEffect(() => {
    contactService.getContacts()
      .then(fetchedContacts => setContacts(c => c.concat(fetchedContacts)))
      .catch(console.error);
  }, []);

  const filteredContacts = contacts && contacts.filter(c => c.name.toLowerCase().includes(filter.toLowerCase())).sort(sortContactsByName);

  const createContact = () => {
    contactService.createContact({name: newName, number: newNumber})
      .then(createdContact => {
        setContacts(contacts.concat(createdContact))
        clearInputs();
        showNotification(NotificationType.SUCCESS, `Added contact: ${createdContact.name}`);
      })
      .catch(e => showNotification(NotificationType.ERROR, "Something went wrong in contact creation"));
  }

  const deleteContact = id => {
    const contactToDelete = contacts.find(c => c.id === id);
    if(window.confirm(`Delete ${contactToDelete.name}?`)) {
      contactService.deleteContact(id)
        .then(() => {
          setContacts(contacts.filter(c => c.id !== id));
          showNotification(NotificationType.SUCCESS, `Deleted contact: ${contactToDelete.name}`);
        })
        .catch(e => showNotification(NotificationType.ERROR, `Couldn't delete ${contactToDelete.name}. Maybe the contact is already deleted`))
    }
  }

  const updateContactNumber = () => {
    const existingContact = contacts.find(c => c.name.toLowerCase() === newName.toLowerCase());
    if(numberIsValid()) {
      contactService.updateNumber(existingContact.id, {name: existingContact.name, number: newNumber})
        .then(updatedContact => {
          setContacts(contacts.filter(c => c.id !== existingContact.id).concat(updatedContact));
          clearInputs();
          showNotification(NotificationType.SUCCESS, `Updated the number of ${existingContact.name}`);
        })
        .catch(e => showNotification(NotificationType.ERROR, `Couldn't update the number of ${existingContact.name}`));
    } else {
      alert("Provide a proper number");
    }
  }

  const attemptContactCreation = () => {
    if(nameAlreadyExists()) {
      if(window.confirm(`${newName} is already added to the phonebook. Update existing number?`)) {
        updateContactNumber();
      }
    } else if(nameIsProvided() && numberIsValid()) {
      createContact();
    } else {
      alert("Please provide both the name and the number. Also, ensure the number is long enough");
    }
  }

  const handleNameChange = event => setNewName(event.target.value);
  const handleNumberChange = event => setNewNumber(event.target.value);
  const handleFilterChange = event => setFilter(event.target.value);
  const handleContactDelete = contactId => deleteContact(contactId);
  const handleContactFormSubmit = event => event.preventDefault() || attemptContactCreation();

  return (
    <div>
      <h2>Phonebook</h2>
        <Notification content={notification} />
        <ContactFilter value={filter} handleChange={handleFilterChange} />
      <h2>Add new contact</h2>
        <ContactForm 
          name={newName} 
          number={newNumber} 
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange}
          handleSubmit={handleContactFormSubmit} />
      <h2>Numbers</h2>
        <ContactList contacts={filteredContacts} onDelete={handleContactDelete} />
    </div>
  )

}

export default App