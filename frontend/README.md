# Google Calendar Clone

A production-quality, frontend-only Google Calendar clone built with React, TypeScript, and Vite. This application features a pixel-perfect recreation of Google Calendar's interface with full CRUD operations for events, multiple view modes, and a mock API layer ready for backend integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:8080`

## ✨ Features Implemented

### Core Views
- **Month View**: Traditional calendar grid with multi-day event spanning
- **Week View**: 7-day view with hourly time slots and all-day event band
- **Day View**: Single day with detailed hourly breakdown
- **Agenda View**: Linear list of upcoming events for next 30 days

### Event Management
- ✅ Create events via:
  - "Create" button
  - Clicking on day/time slots
  - Quick event creation with pre-filled times
- ✅ Edit existing events
- ✅ Delete events
- ✅ All-day events toggle
- ✅ Event details: title, description, location, start/end times
- ✅ Color-coded events matching calendar colors
- ✅ Multiple calendar support with visibility toggles

### Navigation
- ✅ Previous/Next navigation (adapts to current view)
- ✅ "Today" button to jump to current date
- ✅ Mini calendar for quick date selection
- ✅ URL-based routing with view parameter
- ✅ Mobile-responsive sidebar with overlay

### UI/UX
- ✅ Google Calendar aesthetic (colors, spacing, typography)
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Smooth transitions and hover states
- ✅ Event chips with left color bar
- ✅ Overlapping event handling
- ✅ Multi-day event rendering
- ✅ Toast notifications for actions
- ✅ Loading states

### Data Persistence
- ✅ localStorage-based persistence
- ✅ Mock API with simulated async delays
- ✅ Seed data with 30+ demo events
- ✅ Multiple calendars (Personal, Work, Family, Travel)

## 🏗️ Architecture

### Tech Stack
- **React 18** with functional components and hooks
- **TypeScript** for full type safety
- **Vite** for fast development and builds
- **React Router** for navigation
- **date-fns** for date manipulation
- **Tailwind CSS** with custom design system
- **shadcn/ui** for base components

### Project Structure

```
src/
├── api/                    # Mock API layer (ready for backend swap)
│   ├── index.ts           # API exports
│   ├── types.ts           # API interfaces
│   └── mock/              # Mock implementations
│       ├── MockEventAPI.ts
│       ├── MockCalendarAPI.ts
│       └── MockSettingsAPI.ts
├── components/
│   ├── Calendar/          # View components
│   │   ├── MonthView.tsx
│   │   ├── WeekView.tsx
│   │   ├── DayView.tsx
│   │   └── AgendaView.tsx
│   ├── ui/                # Base UI components (shadcn)
│   ├── EventChip.tsx      # Event display component
│   ├── EventModal.tsx     # Event create/edit modal
│   ├── MiniCalendar.tsx   # Sidebar mini calendar
│   ├── Sidebar.tsx        # Main sidebar
│   ├── TopBar.tsx         # Navigation header
│   └── ViewSelector.tsx   # View mode switcher
├── data/
│   └── seed.ts            # Demo data
├── lib/
│   └── date/              # Date utility functions
│       └── index.ts
├── pages/
│   ├── CalendarPage.tsx   # Main calendar page
│   ├── Index.tsx          # Root redirect
│   └── NotFound.tsx       # 404 page
├── types/
│   └── index.ts           # TypeScript type definitions
├── App.tsx                # App root with routing
└── main.tsx               # Entry point
```

### Design System

The app uses a semantic color system defined in `src/index.css`:

- **Primary**: Google Blue (#1a73e8)
- **Event Colors**: Blue, Red, Green, Orange, Purple, Cyan, Gray
- **Semantic Tokens**: Background, foreground, muted, accent, border
- **Calendar-Specific**: Today highlight, selected date, hover states

All colors use HSL format for easy theming and dark mode support.

## 🔌 Backend Integration

The app is architected for easy backend integration. All components consume data through typed API interfaces defined in `src/api/types.ts`.

### To integrate a real backend:

1. **Implement the API interfaces** in `src/api/`:
   - `EventAPI` for event CRUD operations
   - `CalendarAPI` for calendar management
   - `SettingsAPI` for user preferences

2. **Update `src/api/index.ts`** to export your implementations:
   ```typescript
   import { RealEventAPI } from './backend/RealEventAPI';
   export const eventAPI = new RealEventAPI();
   ```

3. **No component changes needed** - all UI components already use the API abstraction

### Example: Google Calendar API Integration

```typescript
// src/api/google/GoogleEventAPI.ts
export class GoogleEventAPI implements EventAPI {
  async getEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
    });
    return response.result.items.map(transformGoogleEvent);
  }
  // ... implement other methods
}
```

## 📊 Data Model

### Event
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  calendarId: string;
  color: CalendarColor;
  location?: string;
  guests?: string[];
  recurrence?: RecurrenceRule;
  timezone?: string;
}
```

### Calendar
```typescript
interface Calendar {
  id: string;
  name: string;
  color: CalendarColor;
  visible: boolean;
}
```

## 🎨 Customization

### Colors
Edit `src/index.css` to customize the color scheme:
```css
:root {
  --primary: 217 91% 60%;        /* Google Blue */
  --event-blue: 217 91% 60%;     /* Event colors */
  /* ... more colors */
}
```

### Views
All view components accept the same props pattern:
```typescript
interface ViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}
```

Add new views by creating components that follow this interface.

## 🔄 Data Management

### Reset Demo Data
Demo data is automatically seeded on first load. To reset:

1. **Clear localStorage**: Open DevTools → Application → Local Storage → Clear
2. **Refresh the page**: Demo data will be re-seeded

### Seed Data
Located in `src/data/seed.ts`:
- 16+ events across different times and dates
- Multi-day events
- All-day events
- Overlapping events
- 4 default calendars

## 📱 Responsive Design

- **Desktop** (1024px+): Full sidebar, all features visible
- **Tablet** (768px-1023px): Collapsible sidebar
- **Mobile** (<768px): Overlay sidebar, simplified navigation

## 🎯 Known Limitations

### Not Yet Implemented
- ⏳ Drag & drop (move/resize events)
- ⏳ Recurring events (data model ready, UI not built)
- ⏳ Event search functionality
- ⏳ Keyboard shortcuts
- ⏳ Event guests management
- ⏳ Timezone selector
- ⏳ Event conflict detection
- ⏳ Print view
- ⏳ ICS export

### Design Approximations
- Custom scrollbar styling (webkit only)
- Some animation timings may differ slightly
- Event collision algorithm is simplified

## 🧪 Testing

Basic test setup is included. To add tests:

```bash
# Install testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom vitest jsdom

# Run tests
npm test
```

Suggested test coverage:
- Event creation flow
- View switching
- Calendar visibility toggles
- Date navigation
- Event filtering by visible calendars

## 🚢 Deployment

```bash
# Build for production
npm run build

# Output will be in dist/
```

Deploy the `dist/` folder to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📝 Environment

- Node.js 18+
- npm 9+

## 🤝 Contributing

This is a demonstration project. Key areas for contribution:
1. Implement drag & drop functionality
2. Add recurring events UI
3. Implement keyboard shortcuts
4. Add comprehensive test coverage
5. Improve accessibility (ARIA labels, keyboard navigation)

## 📄 License

MIT

## 🙏 Acknowledgments

- Design inspiration: Google Calendar
- UI Components: shadcn/ui
- Icons: Lucide React
- Date utilities: date-fns

---

**Note**: This is a frontend-only clone for demonstration purposes. No Google services or APIs are used. All data is stored in browser localStorage.
