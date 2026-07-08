// app/hazkara/page.jsx — מדריך הזכרת ע"ב שמות (אבולעפיה)
import HazkaraGuide from '@/components/kavanot/HazkaraGuide';

export const metadata = {
  title: 'הזכרת ע"ב שמות · שער האמת',
  description: 'מדריך מונפש להזכרת שבעים ושניים השמות לפי שיטת ר\' אברהם אבולעפיה — ניקוד, תנועות ראש, ונשימה.',
};

export default function HazkaraPage() {
  return <HazkaraGuide />;
}
