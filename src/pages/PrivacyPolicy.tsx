import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-accent transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg">Polityka Prywatności</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-5 py-8 space-y-8 text-sm leading-relaxed"
      >
        <div>
          <p className="text-muted-foreground">Ostatnia aktualizacja: 8 marca 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">1. Administrator danych</h2>
          <p>
            Administratorem Twoich danych osobowych jest HRL Community („Serwis"). Możesz
            skontaktować się z nami pod adresem: <span className="text-primary">privacy@hrl.app</span>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">2. Jakie dane zbieramy?</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Adres e-mail i hasło (lub dane z logowania Google/Apple)</li>
            <li>Imię/pseudonim, miasto, rola zawodowa, umiejętności</li>
            <li>Zdjęcia profilowe i bio</li>
            <li>Treść wiadomości (szyfrowane w transmisji)</li>
            <li>Informacje o aktywności w aplikacji (udział w projektach, punkty reputacji)</li>
            <li>Adres IP i dane urządzenia (przeglądarka, system operacyjny)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">3. Cel przetwarzania danych</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Świadczenie usług networkingu i współpracy projektowej</li>
            <li>Weryfikacja tożsamości członków społeczności</li>
            <li>Bezpieczeństwo serwisu i ochrona przed nadużyciami</li>
            <li>Komunikacja z użytkownikami (powiadomienia o projektach/wydarzeniach)</li>
            <li>Wyświetlanie istotnych ogłoszeń społecznościowych</li>
            <li>Wypełnianie obowiązków prawnych</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">4. Podstawa prawna (RODO)</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>Umowa</strong> – świadczenie usług społecznościowych (art. 6 ust. 1 lit. b RODO)</li>
            <li><strong>Zgoda</strong> – marketing, powiadomienia push (art. 6 ust. 1 lit. a RODO)</li>
            <li><strong>Prawnie uzasadniony interes</strong> – bezpieczeństwo, analityka (art. 6 ust. 1 lit. f RODO)</li>
            <li><strong>Obowiązek prawny</strong> – przepisy krajowe i unijne (art. 6 ust. 1 lit. c RODO)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">5. Twoje prawa</h2>
          <p className="text-muted-foreground">Na mocy RODO przysługują Ci następujące prawa:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>Dostępu</strong> – możesz zażądać kopii swoich danych</li>
            <li><strong>Sprostowania</strong> – możesz poprawić nieprawidłowe dane</li>
            <li><strong>Usunięcia</strong> – „prawo do bycia zapomnianym"</li>
            <li><strong>Ograniczenia przetwarzania</strong></li>
            <li><strong>Przenoszenia danych</strong></li>
            <li><strong>Sprzeciwu</strong> – wobec przetwarzania na podstawie prawnie uzasadnionego interesu</li>
            <li><strong>Wycofania zgody</strong> – w każdej chwili</li>
          </ul>
          <p className="text-muted-foreground">
            Aby skorzystać ze swoich praw, skontaktuj się z nami: <span className="text-primary">privacy@hrl.app</span>. 
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">6. Udostępnianie danych</h2>
          <p className="text-muted-foreground">
            Nie sprzedajemy Twoich danych osobowych. Możemy je udostępniać wyłącznie:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Dostawcom infrastruktury technicznej (serwery, bazy danych) – na zasadach umów powierzenia</li>
            <li>Organom ścigania – na podstawie obowiązujących przepisów prawa</li>
            <li>Partnerom reklamowym – wyłącznie anonimowe dane agregowane</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">7. Okres przechowywania danych</h2>
          <p className="text-muted-foreground">
            Dane przechowujemy przez czas świadczenia usług. Po usunięciu konta dane są usuwane
            w ciągu 30 dni, z wyjątkiem danych wymaganych przepisami prawa (do 5 lat).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">8. Pliki cookies</h2>
          <p className="text-muted-foreground">
            Używamy plików cookies niezbędnych do działania serwisu oraz analitycznych (za Twoją zgodą).
            Możesz zarządzać ustawieniami cookies w przeglądarce.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">9. Zmiany polityki prywatności</h2>
          <p className="text-muted-foreground">
            O istotnych zmianach poinformujemy Cię e-mailem lub powiadomieniem w aplikacji
            z co najmniej 14-dniowym wyprzedzeniem.
          </p>
        </section>

        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-muted-foreground text-xs">
            © 2026 HRL Community · HardbanRecords Lab ·{' '}
            <button onClick={() => navigate('/terms')} className="text-primary underline">Regulamin</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
