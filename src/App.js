import React, { Component } from 'react';
import './App.css';
import UserList from './components/UserList';
import UserForm from './components/UserForm';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedUser: null,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      const mappedUsers = data.map((user) => ({
        id: user.id,
        FirstName: user.name,
        LastName: user.username, 
        email: user.email,
        department: user.department || 'N/A', // Add department with default value
      }));

      this.setState({ users: mappedUsers });
    } catch (error) {
      this.setState({ error: 'Failed to fetch users: ' + error.message });
    }
  };

  // adding a user into the userList 

  handleAddUser = async (userData) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      const newUser = await response.json();
  
      // Assign a unique ID based on the maximum ID in the current list
      const maxId = this.state.users.reduce((max, user) => Math.max(max, user.id), 0);
      const uniqueId = maxId + 1;
  
      // Map API response back to form fields with a unique ID
      const mappedUser = {
        id: uniqueId,
        FirstName: newUser.FirstName,
        LastName: newUser.LastName,
        email: newUser.email,
        department: newUser.department || 'N/A',
      };
  
      this.setState((prevState) => ({
        users: [...prevState.users, mappedUser],
        selectedUser: null,
      }));
    } catch (error) {
      this.setState({ error: 'Failed to add user: ' + error.message });
    }
  };
  

// editing the exsisted user from user list getting user details based on the id

  handleEditUser = (userId) => {
    const selectedUser = this.state.users.find((user) => user.id === userId);
    if (selectedUser) {
      this.setState({ selectedUser, error: null });
    } else {
      console.error(`User with ID ${userId} not found in state.`);
    }
    console.log(selectedUser)
  };

  // updating the userlist after editing the required changes

  handleUpdateUser = async (userData) => {
    try {
      const apiUserData = {
        id: userData.id,
        name: userData.FirstName,
        username: userData.LastName,
        email: userData.email,
        department: userData.department,
      };

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userData.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiUserData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUsers = this.state.users.map((user) =>
        user.id === userData.id ? userData : user
      );

      this.setState({ users: updatedUsers, selectedUser: null });
    } catch (error) {
      this.setState({ error: 'Failed to update user: ' + error.message });
    }
  };

  //Deleting an user from userList

  handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const updatedUsers = this.state.users.filter((user) => user.id !== userId);
      this.setState({ users: updatedUsers });
    } catch (error) {
      this.setState({ error: 'Failed to delete user: ' + error.message });
    }
  };

  render() {
    return (
      <div className="container">
        <h1>User Management</h1>
        {this.state.error && <div className="error">{this.state.error}</div>}
        <UserList
          users={this.state.users}
          onEdit={this.handleEditUser}
          onDelete={this.handleDeleteUser}
        />
        <div>
          <h2>{this.state.selectedUser ? 'Edit User' : 'Add User'}</h2>
          <UserForm
            user={this.state.selectedUser}
            onSubmit={
              this.state.selectedUser ? this.handleUpdateUser : this.handleAddUser
            }
          />
        </div>
      </div>
    );
  }
}

export default App;
