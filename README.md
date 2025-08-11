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

## 🏗️ Architecture

![Exight 2.0 Architecture](docs/architecture.svg)

The application follows a modern client-server architecture with:
- **Frontend**: React + TypeScript with local storage for offline capability
- **Backend**: Node.js + Express REST API
- **Database**: PostgreSQL for persistent data storage
- **Data Flow**: Frontend ↔ Backend ↔ Database with local storage fallback

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (for backend database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/exight-expense-tracker.git
cd exight-expense-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up the backend server:
```bash
cd server
cp env.example .env
# Edit .env file with your database credentials
npm install
npm run dev
```

4. Start the frontend development server:
```bash
# In the root directory
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

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

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information.

### Where to Contribute

- **🐛 Bug Fixes**: Check the [Issues](https://github.com/yourusername/exight-expense-tracker/issues) page
- **✨ New Features**: Open a discussion first to align on the feature scope
- **📚 Documentation**: Help improve our docs, README, and code comments
- **🎨 UI/UX**: Enhance the user interface and experience
- **🧪 Testing**: Add tests and improve test coverage
- **🔧 Performance**: Optimize bundle size, loading times, and runtime performance

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our [coding standards](CONTRIBUTING.md#code-style)
4. Commit with conventional commit format: `git commit -m "feat: add amazing feature"`
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Need Help?

- 📖 Read our [Contributing Guide](CONTRIBUTING.md)
- 📋 Check our [Code of Conduct](CODE_OF_CONDUCT.md)
- 🐛 Report bugs via [Issues](https://github.com/yourusername/exight-expense-tracker/issues)
- 💬 Join discussions in [Discussions](https://github.com/yourusername/exight-expense-tracker/discussions)

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