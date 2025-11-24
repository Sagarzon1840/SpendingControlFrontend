# Spending Control Frontend - Implementación Completa

## ✅ Implementado según especificación del backend

### 🔐 Autenticación

- **AuthService**: Login/Register con JWT Bearer
- **AuthGuard**: Protección de ruta /dashboard
- **AuthInterceptor**: Añade token automáticamente a requests
- **SessionStorage**: Token persiste durante la sesión del navegador

### 💰 Monetary Funds (MonetaryFundsController)

- **FundsService**: CRUD completo con PATCH
- **FundsGridComponent**:
  - Listado con edición inline/popup
  - Validaciones: name (1-200), initialBalance (>=0), accountNumberOrDescription (<=100)
  - Tipos: BankAccount, Cash
  - Manejo de errores legible

### 💸 Expenses (ExpensesController)

- **ExpensesService**: CRUD completo + paginación
- **ExpensesGridComponent**:
  - Listado con paginación (10/20/50)
  - Formulario de creación/edición con detalles anidados
  - Validaciones: merchantName (<=200), observations (<=1000), details mínimo 1
  - Master-detail para visualizar items del gasto
  - **Warnings de sobregiro**: alertas cuando balance queda negativo
  - Soporte para DocumentType: Receipt/Invoice/Other

### 📊 Movements (MovementsController)

- **MovementsService**: GET con filtros de fecha y paginación
- **MovementsGridComponent**:
  - Filtros de fecha (from/to)
  - Paginación configurable
  - Listado dinámico según MovementDto del backend

### 📈 Reports (ReportsController)

- **ReportsService**: Budget vs Execution
- **BudgetReportComponent**:
  - Filtros de fecha obligatorios (from/to)
  - Tabla comparativa Budget/Executed
  - Cálculo de varianza y porcentaje
  - Gráfico de barras comparativo
  - Resaltado de sobregiros en rojo

### 🎨 Dashboard

- **DashboardComponent**: navegación entre 4 vistas
  - Monetary Funds
  - Expenses
  - Movements
  - Reports
- Sidebar con logout

### 🛡️ Manejo de Errores

- **ApiService**: formateo de errores de ModelState (.NET)
- Conversión de `{Field: ["message"]}` a texto legible
- Propiedad `readableMessage` en todos los errores
- Sin más `[object Object]`

### 📝 Tipos TypeScript

- **api.models.ts**: DTOs completos
  - MonetaryFundCreateDto / ResponseDto
  - SpendingHeaderCreateDto / ResponseDto
  - OverdraftWarning
  - BudgetVsExecutionItem
  - PaginatedResponse<T>

## 🔧 Validaciones Client-Side

### Monetary Funds

- name: required, 1-200 chars
- type: required (BankAccount | Cash)
- initialBalance: required, >= 0
- accountNumberOrDescription: optional, <= 100 chars

### Expenses

- monetaryFundId: required (select de fondos cargados)
- date: required (ISO date)
- merchantName: optional, <= 200 chars
- observations: optional, <= 1000 chars
- documentType: required (Receipt | Invoice | Other)
- details: array, min 1 item
  - expenseTypeId: required, > 0
  - amount: required, > 0
  - description: optional

## 📦 Estructura de Componentes

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts ✅
│   ├── interceptors/
│   │   └── auth.interceptor.ts ✅
│   ├── services/
│   │   ├── api.service.ts ✅ (GET/POST/PATCH/DELETE + error formatting)
│   │   ├── auth.service.ts ✅
│   │   ├── funds.service.ts ✅
│   │   ├── expenses.service.ts ✅
│   │   ├── movements.service.ts ✅
│   │   └── reports.service.ts ✅
│   └── models/
│       └── api.models.ts ✅
├── features/
│   ├── auth/ ✅
│   └── dashboard/ ✅ (4 vistas)
└── shared/
    └── organisms/
        ├── funds-grid/ ✅
        ├── expenses-grid/ ✅ (con warnings y validaciones)
        ├── movements-grid/ ✅
        └── budget-report/ ✅
```

## 🚀 Flujos Implementados

### Crear Gasto

1. Usuario completa formulario (fund, date, merchant, type)
2. Añade uno o más detalles (expenseTypeId, amount, description)
3. Validación: mínimo 1 detalle, amounts > 0
4. POST a /expenses
5. Si hay warnings de sobregiro → alert con detalles
6. Grid se recarga automáticamente

### Ver Movements

1. Usuario selecciona rango de fechas (default: mes actual)
2. GET /movements?from={iso}&to={iso}&page=1&size=20
3. Paginación automática con DevExtreme

### Generar Reporte Budget vs Execution

1. Usuario selecciona from/to (obligatorios)
2. Click "Generate Report"
3. GET /reports/budget-vs-execution?from={iso}&to={iso}
4. Muestra tabla + gráfico comparativo
5. Resalta varianzas negativas (sobregiros)

## ⚠️ Notas Importantes

1. **MovementDto**: estructura dinámica, se adapta a lo que devuelva Swagger
2. **Warnings de sobregiro**: solo se muestran en creación (POST), no en edición
3. **PATCH vs PUT**: migrado a PATCH para enviar solo campos modificados
4. **Paginación**: page (base 1), size (default 50 en backend)
5. **Fechas**: ISO 8601 (yyyy-MM-ddTHH:mm:ssZ)
6. **SessionStorage**: token se pierde al cerrar navegador

## 🔜 Mejoras Opcionales (no requeridas por spec)

- [ ] Toast notifications en lugar de alerts
- [ ] Manejo 401 automático → redirect a login
- [ ] Expense Types dropdown (si existe endpoint)
- [ ] Filtros avanzados en expenses (por fecha, fund, type)
- [ ] Export a Excel/PDF en reports
- [ ] Validación de expiración JWT
- [ ] Lazy loading de módulos
- [ ] Tests unitarios

## ✨ Características Destacadas

✅ **100% alineado con backend API**  
✅ **Validaciones client-side completas**  
✅ **Manejo de errores robusto**  
✅ **Warnings de sobregiro visibles**  
✅ **Paginación en todos los grids**  
✅ **Filtros de fecha en movements/reports**  
✅ **Gráficos en reportes**  
✅ **TypeScript types para DTOs**  
✅ **Formularios anidados (expenses details)**  
✅ **Master-detail en grids**  
✅ **Autenticación con guards**  
✅ **PATCH para updates parciales**
