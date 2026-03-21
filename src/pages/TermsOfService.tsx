import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-accent transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg">Regulamin Serwisu</h1>
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
          <h2 className="text-xl font-bold">1. Postanowienia ogólne</h2>
          <p className="text-muted-foreground">
            Niniejszy Regulamin określa zasady korzystania z aplikacji HRL Community („Serwis"),
            przeznaczonej do współpracy zawodowej, wymiany wiedzy i rozwoju projektów w ramach 
            ekosystemu HardbanRecords Lab. Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">2. Wymogi wiekowe</h2>
          <p className="text-muted-foreground">
            Serwis jest przeznaczony wyłącznie dla osób pełnoletnich, posiadających pełną zdolność 
            do czynności prawnych. Rejestracja przez osoby niepełnoletnie jest zabroniona.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">3. Rejestracja i konto użytkownika</h2>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Każdy użytkownik może posiadać tylko jedno konto</li>
            <li>Podawane informacje (rola, umiejętności) muszą być prawdziwe i aktualne</li>
            <li>Hasło musi być przechowywane w tajemnicy</li>
            <li>Użytkownik odpowiada za wszelkie działania podjęte z jego konta</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">4. Zasady zachowania</h2>
          <p className="text-muted-foreground">Zabrania się:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Zamieszczania treści obraźliwych, mowy nienawiści, spamu</li>
            <li>Nękania lub prześladowania innych członków społeczności</li>
            <li>Tworzenia fałszywych profili (podszywanie się pod ekspertów)</li>
            <li>Wysyłania spamu, niechcianych ofert handlowych</li>
            <li>Udostępniania poufnych informacji o projektach HRL bez zgody</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">5. Treści użytkowników i Projekty</h2>
          <p className="text-muted-foreground">
            Zamieszczając treści lub dołączając do projektów, użytkownik zobowiązuje się 
            do poszanowania praw autorskich i własności intelektualnej innych członków. 
            Wszelkie zasady dotyczące własności intelektualnej w projektach są określane 
            indywidualnie przez liderów projektów.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">6. Bezpłatność serwisu</h2>
          <p className="text-muted-foreground">
            HRL Community jest <strong>całkowicie bezpłatny</strong>. Podstawowe funkcje
            (networking, tablica projektów, czat, wydarzenia) są dostępne bez opłat. 
            Serwis utrzymuje się z dobrowolnych dotacji i partnerstw.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">7. Reputacja (Punkty Reputacji)</h2>
          <p className="text-muted-foreground">
            Punkty Reputacji to miara zaangażowania w społeczność. Nie mają wartości 
            pieniężnej i nie podlegają wymianie na gotówkę. Mogą być przyznawane 
            za pomoc innym, udział w projektach lub weryfikację konta.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">8. Moderacja i usunięcie konta</h2>
          <p className="text-muted-foreground">
            Administrator zastrzega prawo do zawieszenia lub usunięcia konta użytkownika
            naruszającego zasady społeczności. Użytkownik może samodzielnie usunąć 
            swoje konto w ustawieniach aplikacji.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">9. Wyłączenie odpowiedzialności</h2>
          <p className="text-muted-foreground">
            Serwis nie ponosi odpowiedzialności za treść projektów prowadzonych przez 
            użytkowników, za jakość współpracy między członkami ani za szkody wynikające 
            z przerw w działaniu platformy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">10. Prawo właściwe</h2>
          <p className="text-muted-foreground">
            Regulamin podlega prawu polskiemu. Wszelkie spory będą rozstrzygane przez
            sądy właściwe dla siedziby Administratora.
          </p>
        </section>

        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-muted-foreground text-xs">
            © 2026 HRL Community · HardbanRecords Lab ·{' '}
            <button onClick={() => navigate('/privacy')} className="text-primary underline">Polityka Prywatności</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
