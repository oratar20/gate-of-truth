// app/now/page.jsx — KAVANOT · מסך "עכשיו" בתוך Gate of Truth
import NowExperience from '@/components/kavanot/NowExperience';

export const metadata = {
  title: 'עכשיו · שער האמת',
  description: 'הרגע הנוכחי בלוח הקבלי — זמן, ספירה, וייחוד להתבוננות.',
};

export default function NowPage() {
  return <NowExperience />;
}
