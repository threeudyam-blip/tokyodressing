export default function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <p className="section-label">Our Story</p>
        <h1>Born in Tokyo.<br />Made for the World.</h1>
        <p>Tokyo Dressing was founded on a simple belief: great fashion shouldn't be complicated. We curate the finest urban pieces inspired by Tokyo's vibrant street culture and bring them straight to your doorstep.</p>
      </div>

      <div className="about-content">
        <div className="about-grid">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=80"
            alt="Tokyo street fashion"
          />
          <div className="about-text">
            <p className="section-label">Who We Are</p>
            <h2>Curators of Urban Style</h2>
            <p>We're a team of fashion-forward individuals obsessed with street culture, contemporary design, and the effortless cool that Tokyo fashion embodies. Every piece in our collection is hand-selected for its quality, wearability, and distinctive character.</p>
            <p>Founded in 2022, we started as a small collective importing limited-edition streetwear from Tokyo's most exciting designers. Today, we've grown into India's premier destination for urban fashion, serving thousands of customers across the country.</p>
            <p>We believe fashion is a form of self-expression — a visual language that speaks before you do. Our mission is to give you the vocabulary to say exactly what you mean.</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p className="section-label">What We Stand For</p>
          <h2 className="section-title">Our Values</h2>
        </div>
        <div className="values-grid">
          {[
            ['✨', 'Curation Over Quantity', 'Every piece is thoughtfully selected. We\'d rather carry 200 exceptional styles than 2,000 average ones.'],
            ['🌱', 'Sustainable Choices', 'We actively seek out brands using responsible materials and ethical manufacturing practices.'],
            ['💎', 'Premium Quality', 'We only stock pieces that meet our strict quality standards. If we wouldn\'t wear it, we won\'t sell it.'],
            ['🤝', 'Community First', 'Our customers are our community. We listen, we adapt, and we grow together with you.'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="value-card">
              <div className="value-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="team-section">
        <p className="section-label">The Team</p>
        <h2 className="section-title">People Behind the Brand</h2>
        <div className="team-grid">
          {[
            { name: 'Punit',          role: 'Founder & Owner',        img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
            { name: 'Rohan Mehta',    role: 'Head of Curation',       img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
            { name: 'Priya Sharma',   role: 'Brand & Marketing',      img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
            { name: 'Arjun Nair',     role: 'Operations & Logistics', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
          ].map(({ name, role, img }) => (
            <div key={name} className="team-card">
              <img src={img} alt={name} />
              <div className="team-info">
                <h3>{name}</h3>
                <p>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
