import { render, screen } from '@testing-library/react';
import App from './App';
import MainTextbox from './MainTextbox';
import PostButton from './PostButton';
import PostList from './PostList';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { handleClick , refreshPosts } from './PostButton'
import Banner from './Banner';

describe('Post Textbox', () => {
  test('renders textbox for new posts', () => {
    render(<MainTextbox />)
    const textboxElement = screen.getByRole('textbox');
    expect(textboxElement).toBeInTheDocument();
  });

  test('updates the value on change', () => {
    render(<MainTextbox />)
    const textboxElement = screen.getByRole('textbox');
    userEvent.type(textboxElement, 'Hello World');
    expect(textboxElement.value).toBe('Hello World');
  });

});

// describe('Post Button', () => {
//   test('renders green "Send Post" button', () => {
//     render(<PostButton />)
//     const isLoggedInMock = true;
//     jest.spyOn(PostButton, 'isLoggedIn', 'get').mockReturnValue(isLoggedInMock)
//     const postButton = screen.getByRole('button');
//     expect(postButton).toBeInTheDocument();
//   })
// });

// describe('View Post Button', () => {
//   test('renders gray "View Post" button', () => {
//     render(<App />)
//     const postListButton = screen.getByRole('button');
//     expect(postListButton).toBeInTheDocument();
//   })
    
// });

describe('Login Banner', () => {
  test('renders username text box', () => {
    render(<Banner />)
    const usernameTextbox = screen.getByRole('textbox', { id: "username"});
    expect(usernameTextbox).toBeInTheDocument();
  })
  test('renders password text box', () => {
    render(<Banner />)
    const passwordTextbox = screen.getByRole('textbox', { id: "password"});
    expect(passwordTextbox).toBeInTheDocument();
  })

  test('renders green "Login" and red "Logout" button', () => {
    render(<Banner />)

    expect(screen.getAllByRole('button')).toHaveLength(2);

    const loginButton = screen.getByRole('button', { name: "Login"});
    expect(loginButton).toBeInTheDocument();
  
    const logoutButton = screen.getByRole('button', { name: "Logout"});
    expect(logoutButton).toBeInTheDocument();
  })
  
});