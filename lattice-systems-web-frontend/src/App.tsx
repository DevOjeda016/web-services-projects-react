import { PublicLayout } from './layouts/PublicLayout';
import { Home } from './features/home/Home';
import { ThemeProvider } from './shared/theme';

export default function App() {
  return (
    <ThemeProvider>
      <PublicLayout>
        <Home />
      </PublicLayout>
    </ThemeProvider>
  );
}
