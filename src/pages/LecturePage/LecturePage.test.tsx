import { render, screen } from '@testing-library/react';

test('renders the component', () => {
    render(<div data-testid="element">Hello World</div>);
    expect(screen.getByTestId('element')).toBeInTheDocument();
});
