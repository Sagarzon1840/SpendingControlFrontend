# SpendingControlFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

## About the Project

SpendingControlFrontend is a personal finance management application built with Angular 21 and DevExtreme components. It allows users to track expenses, manage budgets, monitor monetary funds, and generate comparative reports between budgeted and actual spending.

### Key Features

- **User Authentication**: JWT-based authentication with login and registration
- **Expense Types Management**: Create and manage different categories of expenses
- **Monetary Funds**: Track multiple bank accounts and cash funds with real-time balances
- **Budget Management**: Set monthly budgets by expense type
- **Expense Tracking**: Record expenses with detailed breakdowns and automatic budget validation
- **Deposits**: Register deposits to monetary funds
- **Movement History**: View comprehensive transaction history with date filters
- **Budget vs Execution Reports**: Visual charts and tables comparing budgets with actual spending

### Tech Stack

- **Angular 18**: Standalone components architecture
- **DevExtreme**: Professional UI components for data grids, forms, and charts
- **Tailwind CSS**: Utility-first CSS framework for styling
- **RxJS**: Reactive programming with observables
- **TypeScript**: Type-safe development
- **ng-icons**: Icon library with Heroicons

## Project Structure

```
src/
├── app/
│   ├── core/                          # Core application functionality
│   │   ├── guards/
│   │   │   └── auth.guard.ts          # Route protection
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts    # JWT token injection
│   │   ├── models/
│   │   │   └── api.models.ts          # TypeScript interfaces for API
│   │   └── services/                  # Business logic services
│   │       ├── api.service.ts         # Base HTTP service
│   │       ├── auth.service.ts        # Authentication
│   │       ├── budgets.service.ts     # Budget management
│   │       ├── deposits.service.ts    # Deposits management
│   │       ├── expense-types.service.ts
│   │       ├── expenses.service.ts    # Expense tracking
│   │       ├── funds.service.ts       # Monetary funds
│   │       ├── movements.service.ts   # Transaction history
│   │       └── reports.service.ts     # Budget reports
│   │
│   ├── features/                      # Feature modules
│   │   ├── auth/                      # Login & registration
│   │   │   ├── auth.ts
│   │   │   ├── auth.html
│   │   │   └── auth.css
│   │   └── dashboard/                 # Main application dashboard
│   │       ├── dashboard.ts
│   │       ├── dashboard.html
│   │       └── dashboard.css
│   │
│   ├── shared/                        # Shared components (Atomic Design)
│   │   ├── atoms/                     # Basic UI elements
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── select/
│   │   │   ├── textarea/
│   │   │   ├── dx-button-wrapper/     # DevExtreme button wrapper
│   │   │   └── dx-text-box-wrapper/   # DevExtreme text input wrapper
│   │   ├── molecules/                 # Composite components
│   │   │   ├── form-field/
│   │   │   └── modal/
│   │   └── organisms/                 # Complex feature components (DevExtreme grids & charts)
│   │       ├── budget-report/         # Budget vs execution charts (DxChart, DxDataGrid)
│   │       ├── budgets-grid/          # Monthly budget management (DxDataGrid, DxDateBox)
│   │       ├── deposits-grid/         # Deposit registration (DxDataGrid, DxSelectBox)
│   │       ├── expense-types-grid/    # Expense categories (DxDataGrid)
│   │       ├── expenses-grid/         # Expense tracking with details (DxDataGrid)
│   │       ├── funds-grid/            # Monetary fund management (DxDataGrid)
│   │       ├── login-form/
│   │       ├── register-form/
│   │       └── movements-grid/        # Transaction history (DxDataGrid, DxDateBox)
│   │
│   ├── app.config.ts                  # App configuration & providers
│   ├── app.routes.ts                  # Route definitions
│   └── app.ts                         # Root component
│
├── environments/                      # Environment configurations
│   ├── environment.ts                 # Development settings
│   └── environment.prod.ts            # Production settings
│
├── styles.css                         # Global styles
└── main.ts                            # Application entry point
```

### Design Patterns

- **Atomic Design**: Component organization (atoms, molecules, organisms)
- **Standalone Components**: Modern Angular architecture without NgModules
- **Service Layer**: Separation of business logic from presentation
- **Reactive Forms**: Type-safe form handling with validation
- **Custom Store Pattern**: DevExtreme CustomStore for CRUD operations

## Environment Configuration

This project uses environment-specific configuration files to manage different settings for development and production.

### Environment Files

- `src/environments/environment.ts` - Development environment configuration
- `src/environments/environment.prod.ts` - Production environment configuration

### How Environment Selection Works

Angular CLI automatically selects the appropriate environment file based on the build configuration:

**Development Mode:**

```bash
ng serve
# or
npm start
```

Uses `environment.ts` with development settings (e.g., `apiUrl: 'https://localhost:7100'`)

**Production Build:**

```bash
ng build --configuration production
# or
ng build --prod
```

The `fileReplacements` configuration in `angular.json` automatically replaces `environment.ts` with `environment.prod.ts` during the build process.

### Configuration

To set up your environment:

1. Copy `.env.example` to create your local configuration
2. Update `src/environments/environment.prod.ts` with your production API URL
3. Always import environment in your code from the same location:
   ```typescript
   import { environment } from '../environments/environment';
   ```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
