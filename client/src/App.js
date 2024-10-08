
import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import HeaderTask from './components/HeaderTask';
import BodyTask from './components/BodyTask';


const server_ip = 'web-stock-beryl.vercel.app';




function App() {

  const [true_username, setUsername] = useState("");
  const [loggedin, setLoggedin] = useState(false);
  const [curr_tab, setCurr_tab] = useState(1);
 

  const [message, setMessage] = useState('');
  const [alert_type, setAlertType] = useState(-1);

  const [guest, setGuest] = useState(false);
 


  useEffect(() => {
    // if username is empty string dont post
    if (true_username==='') {
      return;
    }
    // if user is a guest dont post to server
    if (guest) return;
    // this useEffect hook gets called on any change to tasks,
    // putting the new task list to server using saved username
  
   

  }, [ guest, true_username])

  // every change to current tab, reset alert
  useEffect(() => {
    setAlertType(-1);
  }, [curr_tab])

  const HandleLogin = (username, password) => {
  
    fetch(`https://${server_ip}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => {

        // Handle the response from the server
        if (response.status === 200) {
          // Login successful
          
          return response.json(); // Parse the response body as JSON
        } else if (response.status === 401) {
          // Invalid password
          setMessage('Wrong Password');
          setAlertType(0);
          throw new Error('Wrong password');
        } else if (response.status === 404) {
          // User not found
          setMessage('User not found');
          setAlertType(0);
          throw new Error('User not found');
        } else {
          // Other errors
          console.error('Error occurred:', response.statusText);
          throw new Error('Error occurred');
        }
      })
      .then(data => {
        // Access the parsed data

        setUsername(username);
     
        
        
        setLoggedin(true);
        
       

      })
      .catch(error => {
        console.error('Error occurred:', error);
      });
  };

  const handleContact = (name, email, message) => {
    fetch(`https://${server_ip}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setMessage('Email sent successfully!');
        setAlertType(1);
      } else {
        setMessage('Failed to send email. Please try again.');
        setAlertType(0);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
      setAlertType(0);
    });
  }

  // SERVER SIGNUP
  const HandleSignup = (username, email, password, confirmPassword) => {
    if (username.trim() === '') {
      setMessage('Username cannot be empty!');
      setAlertType(0);
      return;
    }

    if (password.trim() === '') {
      setMessage('Password cannot be empty!');
      setAlertType(0);
      return;
    }

    if (username.includes(' ')) {
      setMessage('Username cannot contain spaces!');
      setAlertType(0);
      return;
    }

    if (username.length >=20) {
      setMessage('Username must not exceed 20 characters!');
      setAlertType(0);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      setAlertType(0);
      return;
    }

    const validateEmail = email => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    };
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      setMessage('Please enter a valid email address');
      setAlertType(0);
      return;
    }


    fetch(`https://${server_ip}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password })
    })
      .then(response => {
        // Handle the response from the server
        if (response.status === 200) {
          // Signup successful
          setMessage('Signup Successful');
          setAlertType(1);

          return response.json(); // Parse the response body as JSON
        } else if (response.status === 401) {
          // Username Taken
          setMessage('Username Already Taken');
          setAlertType(0);
          throw new Error('Username Taken');
        } else {
          // Other errors

          console.error('Error occurred:', response.statusText);
          throw new Error('Error occurred');
        }
      })
      .catch(error => {
        console.error('Error occurred:', error);
      });
  }

  const HandleLogoff = () => {
    setLoggedin(false);
    setGuest(false);

    setUsername("");
    
    setMessage('');
    setAlertType(-1);
    setCurr_tab(1);
  };


  const HandleGuest = () => {
    setLoggedin(true);
    setGuest(true);
  }

  if (!loggedin) {
    return (
      <div className="App">
        <Header curr_tab={curr_tab} setCurr_tab={setCurr_tab}></Header>
        <Body HandleSignup={HandleSignup} curr_tab={curr_tab} setCurr_tab={setCurr_tab} HandleLogin={HandleLogin}
          message={message} alert_type={alert_type} HandleGuest={HandleGuest} handleContact = {handleContact}></Body>

      </div>
    );
  }

  else {
    return (
      <div className="App">
        <HeaderTask HandleLogoff={HandleLogoff}></HeaderTask>
        <BodyTask ></BodyTask>
      </div>
    );
  }
}

export default App;

