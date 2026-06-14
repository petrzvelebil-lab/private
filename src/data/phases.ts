import { CyclePhase } from '../types';

export const PHASES: CyclePhase[] = [
  {
    id: 'menstruation',
    name: 'Menstruace',
    dayStart: 1,
    dayEnd: 5,
    color: '#E74C6F',
    icon: '🩸',
    description: 'Estrogen i progesteron jsou na minimu. Tělo se zbavuje děložní sliznice.',
    feelings: [
      'Únava, nízká energie',
      'Křeče, bolesti břicha a zad',
      'Citlivost, potřeba klidu',
    ],
    tips: [
      'Připrav termofor nebo nahřívací polštářek',
      'Uvař čaj a připrav lehké jídlo',
      'Nabídni pomoc v domácnosti — vaření, úklid, nákup',
      'Netlač na společenské aktivity',
      'Nabídni filmový večer, deku, klid',
      'Nekomentuj náladu',
      'Měj doma zásoby menstruačních potřeb',
    ],
    antiTips: [
      'Neptej se "co je ti" každých 30 minut',
      'Neplánuj náročné aktivity',
      'Nekomentuj, že "je zase naštvaná"',
    ],
  },
  {
    id: 'follicular',
    name: 'Folikulární fáze',
    dayStart: 6,
    dayEnd: 13,
    color: '#4CAF7D',
    icon: '🌱',
    description: 'Estrogen stoupá, energie roste. Tělo se připravuje na ovulaci.',
    feelings: [
      'Rostoucí energie a motivace',
      'Lepší nálada, kreativita',
      'Sociální, komunikativní',
    ],
    tips: [
      'Plánuj společné aktivity, výlety, rande',
      'Podpoř její projekty a plány',
      'Dobré období pro důležité rozhovory',
      'Společný sport, procházky, dobrodružství',
      'Buď aktivní a iniciativní',
    ],
    antiTips: [
      'Neplýtvej touhle energií — plánuj dopředu',
      'Neodkládej společný čas',
    ],
  },
  {
    id: 'ovulation',
    name: 'Ovulace',
    dayStart: 14,
    dayEnd: 16,
    color: '#FFB84D',
    icon: '☀️',
    description: 'Peak estrogenu. Vajíčko se uvolňuje z vaječníku.',
    feelings: [
      'Nejvyšší energie a sebevědomí',
      'Vyšší libido',
      'Komunikativní, zářivá',
    ],
    tips: [
      'Romantika, pozornost, komplimenty',
      'Společenské akce, večeře venku',
      'Nejlepší čas pro důležité rozhovory',
      'Buď přítomný a pozorný',
      'Plánuj rande night',
    ],
    antiTips: [
      'Neignoruj ji — tohle je peak sociálního období',
      'Neodkládej romantiku',
    ],
  },
  {
    id: 'luteal',
    name: 'Luteální fáze',
    dayStart: 17,
    dayEnd: 28,
    color: '#9B6DB7',
    icon: '🌙',
    description:
      'Progesteron stoupá, pak padá. Posledních 5–7 dní se mohou objevit PMS symptomy.',
    feelings: [
      'Postupně klesající energie',
      'PMS: podrážděnost, úzkost, smutek',
      'Cravings (sladké, slané)',
      'Bolesti prsou, nadýmání',
      'Potřeba comfort a bezpečí',
    ],
    tips: [
      'Trpělivost s výkyvy nálad',
      'Comfort food — měj doma oblíbené snacky',
      'Nabídni masáž, koupel, péči',
      'Sniž očekávání na společné aktivity',
      'Neargumentuj, nevysvětluj, jen poslouchej',
      'Poslední týden: zkontroluj zásoby menstruačních potřeb',
      'Drobné pozornosti (květiny, oblíbená věc)',
    ],
    antiTips: [
      'Neříkej "uklidni se" nebo "to bude dobrý"',
      'Neplánuj stresové situace',
      'Nekomentuj cravings nebo jídlo',
    ],
  },
];

export function getPhaseForDay(day: number, cycleLength: number): CyclePhase {
  const ratio = cycleLength / 28;
  const boundaries = [
    { phase: PHASES[0], start: 1, end: Math.round(5 * ratio) },
    { phase: PHASES[1], start: Math.round(5 * ratio) + 1, end: Math.round(13 * ratio) },
    { phase: PHASES[2], start: Math.round(13 * ratio) + 1, end: Math.round(16 * ratio) },
    { phase: PHASES[3], start: Math.round(16 * ratio) + 1, end: cycleLength },
  ];

  for (const b of boundaries) {
    if (day >= b.start && day <= b.end) {
      return { ...b.phase, dayStart: b.start, dayEnd: b.end };
    }
  }
  return { ...PHASES[3], dayStart: boundaries[3].start, dayEnd: cycleLength };
}

export function getNextPhase(currentPhaseId: string): CyclePhase {
  const idx = PHASES.findIndex((p) => p.id === currentPhaseId);
  return PHASES[(idx + 1) % PHASES.length];
}
