# Exight - Expense Tracker

**Insights for your expenses.**

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

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

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

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

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

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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