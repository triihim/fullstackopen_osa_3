export const ContactFilter = ({value, handleChange}) => {
    return (
      <div>
        filter: <input value={value} onChange={handleChange} />
      </div>
    );
  }
  
export const ContactForm = (props) => {
    const name = props.name;
    const number = props.number;
    const handleNameChange = props.handleNameChange;
    const handleNumberChange = props.handleNumberChange;
    const handleSubmit = props.handleSubmit;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={name} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={number} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    );
}
  
export const ContactList = ({contacts, onDelete}) => {
    return (
      <div>
        {contacts.map(c => {
          return (
            <div key={c.id}>
              <span>{c.name} {c.number}</span>
              <button onClick={() => onDelete(c.id)}>Delete</button>
            </div>
          );
        })}
      </div>
    );
}
