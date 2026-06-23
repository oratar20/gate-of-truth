// app/reveal/page.jsx — "קבל ייחוד לרגע" בתוך שער האמת
import RevealExperience from '@/components/kavanot/RevealExperience';

export const metadata = {
  title: 'קבל ייחוד לרגע · שער האמת',
  description: 'סריקת הרגע הקבלי והצעת מוקד להתבוננות — ייחוד, שם מע״ב, או צירוף שם הוי״ה.',
};

export default function RevealPage() {
  return <RevealExperience />;
}
