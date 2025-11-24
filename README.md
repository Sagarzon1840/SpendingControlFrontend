# SpendingControlFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

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
