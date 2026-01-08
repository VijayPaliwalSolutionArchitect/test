const Footer = () => {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] py-6">
      <div className="container mx-auto px-4 text-center text-[var(--text-secondary)]">
        <p>Tech Intelligence Platform &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
