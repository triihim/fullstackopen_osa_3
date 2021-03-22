import axios from "axios";

const url = "/api/persons";

const createContact = contact => {
    const req = axios.post(url, contact);
    return req.then(res => res.data);
}

const getContacts = () => {
    const req = axios.get(url);
    return req.then(res => res.data);
}

const deleteContact = id => {
    const req = axios.delete(`${url}/${id}`)
    return req.then(res => res.data);
}

const updateNumber = (id, updatedContact) => {
    const req = axios.put(`${url}/${id}`, updatedContact);
    return req.then(res => res.data);
}

export default {
    createContact,
    getContacts,
    deleteContact,
    updateNumber
}