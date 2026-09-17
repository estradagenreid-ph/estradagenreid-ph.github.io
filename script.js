// Navigation remains fully functional when JavaScript is unavailable.
document.getElementById('year').textContent = new Date().getFullYear();
const sectionLinks = [...document.querySelectorAll('.site-header nav a')];
if ('IntersectionObserver' in window) {
  const visibleSections = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleSections.add(entry.target.id);
      else visibleSections.delete(entry.target.id);
    });
    const activeLink = sectionLinks.find(link => visibleSections.has(link.hash.slice(1)));
    sectionLinks.forEach(link => {
      if (link === activeLink) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-10% 0px -45% 0px', threshold: 0 });
  sectionLinks.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section) observer.observe(section);
  });
}
