export const metadata = {
  title: 'שער האמת | Gate of Truth',
  description: 'מענה רוחני מבוסס חכמת הקבלה, החסידות, והפסיכולוגיה הרוחנית',
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700;900&family=David+Libre:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#06040f' }} suppressHydrationWarning>{children}</body>
    </html>
  );
}
