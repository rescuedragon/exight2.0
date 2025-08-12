import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';

function Header() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold">Exight</h1>
      <ThemeToggle />
    </div>
  );
}

describe('Header snapshot', () => {
  it('renders stable markup', () => {
    const { container } = render(<Header />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
