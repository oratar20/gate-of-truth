// app/havaya/page.jsx — שם הוי"ה: מילוייו וצירופיו בתוך Gate of Truth
import HavayaView from '@/components/kavanot/HavayaView';

export const metadata = {
  title: 'שם הוי״ה · שער האמת',
  description: 'השם המפורש — ארבעת המילויים (ע״ב, ס״ג, מ״ה, ב״ן) ושנים-עשר הצירופים.',
};

export default function HavayaPage() {
  return <HavayaView />;
}
