import React, { useState } from 'react';


function ContactUs(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setlocMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    props.handleContact(name, email, message);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Handle form submission logic here, e.g., sending data to an API

  //   // Example feedback
  //   props.setMessage('Your message has been sent!');
  //   props.setAlertType(1); // Success alert
  // };

  return (
    <div className="contact-us">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            id="message"
            className="form-control"
            rows="4"
            value={message}
            onChange={(e) => setlocMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}


export default ContactUs;
