import React, { Component } from 'react';

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      FirstName: '',
      LastName: '',
      email: '',
      department: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.setState({
        id: this.props.user?.id || '',
        FirstName: this.props.user?.FirstName || '',
        LastName: this.props.user?.LastName || '',
        email: this.props.user?.email || '',
        department: this.props.user?.department || '',
      });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state);
    this.setState({
      id: '',
      FirstName: '',
      LastName: '',
      email: '',
      department: '',
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="user-form">
        <div>
          <label htmlFor="FirstName" className="label">First Name:</label>
          <input
            type="text"
            id="FirstName"
            name="FirstName"
            value={this.state.FirstName}
            onChange={this.handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="LastName" className="label">Last Name:</label>
          <input
            type="text"
            id="LastName"
            name="LastName"
            value={this.state.LastName}
            onChange={this.handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="department" className="label">Department:</label>
          <input
            type="text"
            id="department"
            name="department"
            value={this.state.department}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit" className="label">
          {this.props.user ? 'Update' : 'Add'}
        </button>
      </form>
    );
  }
}

export default UserForm;
