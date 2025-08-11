# Exight - Expense Tracker

**Insights for your expenses.** 🚀 Auto-deployment enabled!

A modern, intuitive expense tracking application built with React, TypeScript, and Tailwind CSS. Track your EMIs, recurring expenses, and get detailed insights into your financial commitments.

## ✨ Features

- **📊 Dashboard Overview**: Get instant insights with monthly expenses, yearly projections, and active expense counts
- **💳 Multiple Expense Types**: Track EMIs, Personal Loans, and Borrowed Money
- **🔄 Recurring & Fixed-Term Expenses**: Handle both ongoing and time-limited financial commitments
- **💰 Partial Payments**: Make and track partial payments towards your expenses
- **📈 Analytics**: Detailed charts and visualizations of your spending patterns
- **📋 Action History**: Complete log of all actions with timestamps
- **🌙 Dark/Light Mode**: Beautiful themes for any preference
- **💾 Local Storage**: Your data stays private and secure on your device

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/exight-expense-tracker.git
cd exight-expense-tracker
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL (for backend)

### Full Setup

See [Installation Guide](docs/installation.md) for detailed setup instructions including backend configuration.

## 🏗️ Architecture

![Exight 2.0 Architecture](public/architecture-diagram.svg)

The application follows a modern client-server architecture with:

- **Frontend**: React + TypeScript with Vite build tool
- **Backend**: Node.js + Express API server
- **Database**: PostgreSQL for persistent data storage
- **Local Storage**: Browser storage for offline functionality
- **External APIs**: Integration with financial services

## 🛠️ Built With

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Beautiful icons
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Recharts** - Responsive charts
- **Next Themes** - Theme management

## 📱 Usage

### Adding Expenses

1. Click the "Add Expense" button
2. Fill in the expense details (name, type, amount, etc.)
3. Set whether it's recurring or has a fixed term
4. Save to start tracking

### Making Payments

- For fixed-term expenses, use the "Partial Payment" button
- Track your progress with visual progress bars
- All payments are logged in the action history

### Viewing Analytics

- Click "Analytics" to see detailed charts
- View spending patterns and projections
- Export data for external analysis

### Action History

- Click the history icon (top-right) to view all actions
- See timestamps for every action taken
- Track your financial management activities

## 🎨 Customization

The app uses Tailwind CSS for styling. You can customize:

- Colors in `tailwind.config.ts`
- Components in `src/components/`
- Themes in the theme provider

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Where to Contribute

- **🐛 Bug Fixes**: Check the [Issues](https://github.com/yourusername/exight-expense-tracker/issues) page
- **🚀 New Features**: Open a feature request issue first
- **📚 Documentation**: Help improve docs, README, or add examples
- **🎨 UI/UX**: Improve the user interface and experience
- **🧪 Testing**: Add tests or improve test coverage
- **🔧 Performance**: Optimize code and improve performance

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow our [Development Conventions](CONVENTIONS.md)
4. Make your changes and test thoroughly
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

**Note**: This project uses npm as the package manager. If you prefer yarn or bun, you can use their equivalent commands:

- **yarn**: `yarn dev`, `yarn build`, `yarn lint`
- **bun**: `bun run dev`, `bun run build`, `bun run lint`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Shadcn/ui](https://ui.shadcn.com/) components
- Icons by [Lucide](https://lucide.dev/)
- Inspired by modern financial management needs

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ for better financial management**
