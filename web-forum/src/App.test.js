import { render, screen } from '@testing-library/react';
import App from './App';
import MainTextbox from './MainTextbox';
import PostButton from './PostButton';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { handleClick , refreshPosts } from './PostButton'

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

describe('Post Button', () => {
  test('renders green "Send Post" button', () => {
    render(<PostButton />)
    const postButton = screen.getByRole('button');
    expect(postButton).toBeInTheDocument();
  })
    
  // Currently having issues when running this test. Can't mock "handleClick" correctly.
  test('calls onClick handler when clicked', () => {
    render(<PostButton label="Send Post" />);
    const postButton = screen.getByText("Send Post");
    jest.mock()
    fireEvent.click(postButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  })
});