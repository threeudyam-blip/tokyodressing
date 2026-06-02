import { useState } from 'react';

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <p className="section-label">Get in Touch</p>
        <h1>We'd Love to Hear From You</h1>
        <p>Questions, feedback, or just want to say hello? Our team typically responds within 24 hours.</p>
      </div>

      <div className="contact-grid">
        {/* Info card */}
        <div className="contact-info-card">
          <h2>Contact Information</h2>

          {[
            { icon: '📧', label: 'Email', text: 'threeudyam@gmail.com' },
            { icon: '📞', label: 'Phone', text: '+91 97837 83369\nMon–Sat, 10 AM – 7 PM' },
            { icon: '📍', label: 'Address', text: 'Tokyo Dressing\nbuilding no. 161 ,Gurgaon road,Manesar\nGurugram,Haryana,122101,Teekli BO,Haryana' },
            { icon: '🧾', label: 'GST Number', text: '06JCLPP1285E1ZB' },
          ].map(({ icon, label, text }) => (
            <div key={label} className="contact-detail">
              <span className="contact-icon">{icon}</span>
              <div>
                <h4>{label}</h4>
                <p style={{ whiteSpace: 'pre-line' }}>{text}</p>
              </div>
            </div>
          ))}

        </div>

        {/* Form */}
        <div className="contact-form-card">
          <h2>Send Us a Message</h2>

          {submitted ? (
            <div className="form-success">
              ✅ Message received! We'll get back to you within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input id="name" name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select id="subject" name="subject" value={form.subject} onChange={handleChange}>
                  <option value="">Select a topic</option>
                  <option>Order Enquiry</option>
                  <option>Returns & Exchanges</option>
                  <option>Product Information</option>
                  <option>Wholesale / B2B</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} placeholder="How can we help you?" value={form.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="submit-btn">Send Message →</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
