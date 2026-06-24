// app/sefirot/page.jsx — עץ עשר הספירות בתוך שער האמת
import SefirotTree from '@/components/kavanot/SefirotTree';

export const metadata = {
  title: 'עץ הספירות · שער האמת',
  description: 'עשר הספירות, ירידת האור וחזרתו לכתר (הרמח"ל), והשם שכנגד כל ספירה.',
};

export default function SefirotPage() {
  return <SefirotTree />;
}
