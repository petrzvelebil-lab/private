import { PartnerPreferences, PhaseId } from '../types';

export function getPersonalizedTips(
  phaseId: PhaseId,
  preferences: PartnerPreferences | null,
  partnerName: string
): string[] {
  if (!preferences) return [];

  const tips: string[] = [];
  const name = partnerName || 'partnerka';
  const { comfortItems, soothingActivities, loveLanguage, customRituals } = preferences;

  if (phaseId === 'menstruation') {
    if (comfortItems.tea) tips.push(`Uvař ${name} její oblíbený ${comfortItems.tea}`);
    if (comfortItems.chocolate)
      tips.push(`Měj doma zásobu: ${comfortItems.chocolate}`);
    if (comfortItems.comfortFood)
      tips.push(`Objednej nebo uvař ${comfortItems.comfortFood}`);
    if (comfortItems.movieGenre)
      tips.push(`Pusťte si spolu ${comfortItems.movieGenre}`);
    if (soothingActivities.includes('koupel'))
      tips.push(`Připrav ${name} teplou koupel`);
    if (soothingActivities.includes('masáž'))
      tips.push(`Nabídni ${name} masáž`);
    if (soothingActivities.includes('ticho'))
      tips.push(`Dej ${name} prostor a klid`);
    if (loveLanguage === 'acts_of_service')
      tips.push('Převezmi domácí práce bez ptaní');
    if (loveLanguage === 'physical_touch')
      tips.push('Nabídni objetí a blízkost (bez tlaku)');
    if (loveLanguage === 'words_of_affirmation')
      tips.push(`Řekni ${name}, že je skvělá, i když se necítí nejlíp`);
  }

  if (phaseId === 'follicular') {
    if (soothingActivities.includes('procházka'))
      tips.push(`Vezmi ${name} na procházku — má teď energii`);
    if (loveLanguage === 'quality_time')
      tips.push('Naplánuj společný výlet nebo aktivitu');
    if (loveLanguage === 'gifts')
      tips.push(`Překvap ${name} malým dárkem — ocení to`);
    if (comfortItems.movieGenre)
      tips.push(`Zajděte spolu na nový ${comfortItems.movieGenre}`);
  }

  if (phaseId === 'ovulation') {
    if (loveLanguage === 'words_of_affirmation')
      tips.push(`Komplimenty! ${name} je teď v plné síle`);
    if (loveLanguage === 'quality_time')
      tips.push('Naplánuj rande — restaurant, koncert, cokoliv společného');
    if (loveLanguage === 'physical_touch')
      tips.push('Romantická blízkost — tohle je ideální období');
    if (loveLanguage === 'gifts')
      tips.push(`Květiny nebo drobná pozornost pro ${name}`);
  }

  if (phaseId === 'luteal') {
    if (comfortItems.snack)
      tips.push(`Nakup zásoby: ${comfortItems.snack}`);
    if (comfortItems.chocolate)
      tips.push(`Měj po ruce ${comfortItems.chocolate}`);
    if (comfortItems.comfortFood)
      tips.push(`Comfort food time: ${comfortItems.comfortFood}`);
    if (comfortItems.tea)
      tips.push(`Uvař ${comfortItems.tea} — pomůže s PMS`);
    if (soothingActivities.includes('film'))
      tips.push(`Filmový večer — ${name} to teď potřebuje`);
    if (soothingActivities.includes('vlastní prostor'))
      tips.push(`Dej ${name} vlastní prostor, až si o něj řekne`);
    if (loveLanguage === 'acts_of_service')
      tips.push('Udělej večeři, umyj nádobí, prostě pomáhej');
    if (loveLanguage === 'words_of_affirmation')
      tips.push(`Řekni ${name}, že ji miluješ — i když je "otravná"`);
    if (loveLanguage === 'physical_touch')
      tips.push('Nabídni masáž nebo objetí — PMS bolí');
  }

  customRituals.forEach((ritual) => {
    if (ritual.trim()) {
      if (phaseId === 'menstruation' || phaseId === 'luteal') {
        tips.push(ritual);
      }
    }
  });

  return tips.slice(0, 5);
}
