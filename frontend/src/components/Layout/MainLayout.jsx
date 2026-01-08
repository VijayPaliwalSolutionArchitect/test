import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
