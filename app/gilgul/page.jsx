// app/gilgul/page.jsx — גלגול הניקוד (אור השכל · אבולעפיה)
import GilgulGuide from '@/components/kavanot/GilgulGuide';

export const metadata = {
  title: 'גלגול הניקוד · שער האמת',
  description: 'גלגול חמשת הניקודים לפי אור השכל של ר\' אברהם אבולעפיה — כל אות בכל הניקודים, עם תנועות ראש ונשימה.',
};

export default function GilgulPage() {
  return <GilgulGuide />;
}
