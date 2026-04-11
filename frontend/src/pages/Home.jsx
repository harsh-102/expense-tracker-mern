import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import { CheckCircle, BarChart3, CreditCard, ArrowRight, Star, Quote, Zap, ShieldCheck } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

// Dummy company data for Marquee
const COMPANIES = ["ACME Corp", "Stark Industries", "Wayne Enterprises", "Globex", "Initech", "Oscorp", "Cyberdyne", "Umbrella Corp", "Soylent", "Massive Dynamic"];

// Dummy Testimonials
const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    role: "Chief Financial Officer",
    company: "Initech",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    text: "Expensor completely transformed how we handle monthly closing. What used to take our finance team an entire week is now achieved in 48 hours. Absolute game changer."
  },
  {
    name: "Marcus Thorne",
    role: "VP of Operations",
    company: "Globex",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop",
    text: "The two-level approval workflow perfectly maps to our corporate structure. We caught double the overspending in Q1 simply because of the automated custom limit warnings."
  },
  {
    name: "Elena Rodriguez",
    role: "Sales Director",
    company: "Acme Corp",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop",
    text: "As someone constantly traveling, snapping a picture of a receipt and submitting a draft report from an airport lounge is frictionless. No more lost paper trails."
  }
];

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: '0', margin: '0', background: 'var(--bg-main)' }}>
      {/* Navbar area */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1.5rem 3rem',
        backgroundColor: 'var(--card-bg)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border-color)',
        alignItems: 'center'
      }}>
        <h2 style={{ color: 'var(--color-primary-dark)', margin: 0, letterSpacing: '0.05em' }}>Expensor.</h2>
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#how-it-works" style={{ color: 'var(--text-main)', fontWeight: '500' }}>Workflow</a>
          <a href="#platform" style={{ color: 'var(--text-main)', fontWeight: '500' }}>Features</a>
          <a href="#testimonials" style={{ color: 'var(--text-main)', fontWeight: '500' }}>Testimonials</a>

          <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem', alignItems: 'center' }}>
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" style={{ alignSelf: 'center', color: 'var(--text-main)', fontWeight: '600' }}>Login</Link>
                <Link to="/signup" className="btn btn-primary">Sign up Company</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8rem 2rem',
        textAlign: 'center',
        minHeight: '80vh',
        overflow: 'hidden'
      }}>
        <AnimatedBackground />

        <div className="hero-content">
          <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', maxWidth: '900px', lineHeight: '1.1', textShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
            Simplified Expense Tracking<br /><span className="text-gradient">for Modern Teams.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', color: 'var(--text-muted)' }}>
            Automate business expenses, speed up reimbursements, and easily control your company spending with total visibility.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '30px' }}>
              Start for Free <ArrowRight size={20} />
            </Link>
            <a href="#how-it-works" className="btn" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '30px', background: 'var(--card-bg)' }}>
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Trusted By Marquee */}
      <section style={{ padding: '2rem 0', background: 'var(--bg-main)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', position: 'relative', zIndex: 10 }}>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontWeight: '600' }}>Trusted by innovative teams worldwide</p>
        <div className="marquee-container">
          {/* Render twice for continuous illusion */}
          <div className="marquee-content">
            {[...COMPANIES, ...COMPANIES].map((company, i) => (
              <div key={i} style={{
                margin: '0 3rem',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--text-main)',
                opacity: 0.4,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <ShieldCheck size={24} /> {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '8rem 2rem', background: 'var(--bg-main)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>From receipt to reimbursement in <span className="text-gradient">record time.</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.7' }}>
              Stop chasing down paper trails. Setup your organizational hierarchy and let Expensor handle the routing, checking, and alerts automatically.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-primary-dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Employees Submit Drafts</h4>
                  <p style={{ color: 'var(--text-muted)' }}>Employees log expenses with receipts attached to dynamic categories, directly checking against custom company limits.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-accent-rose)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Managers Review Instantly</h4>
                  <p style={{ color: 'var(--text-muted)' }}>Direct supervisors are notified when reports are submitted, allowing them to approve or reject with contextual notes.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', flexShrink: 0 }}>3</div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Admins Finalize & Reimburse</h4>
                  <p style={{ color: 'var(--text-muted)' }}>The finance team hits final approval and triggers payouts, tracking total capital flow perfectly in real-time dashboards.</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
            <img
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop"
              alt="Finance Workspace"
              className="animate-float"
              style={{ width: '100%', maxWidth: '600px', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="platform" style={{ padding: '6rem 2rem', background: 'var(--card-bg)', position: 'relative', zIndex: 10, borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Why choose Expensor?</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>

          <div className="card" style={{ flex: '1 1 300px', textAlign: 'center', padding: '3rem 2rem' }}>
            <CheckCircle size={48} color="var(--color-accent-rose)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem' }}>Two-Level Approval</h3>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Manager and Admin level approvals workflow baked right into your spending tracker securely.</p>
          </div>

          <div className="card" style={{ flex: '1 1 300px', textAlign: 'center', padding: '3rem 2rem' }}>
            <CreditCard size={48} color="var(--color-accent-rose)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem' }}>Smart Limits</h3>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Customizable spending caps per category to actively prevent over-spending and warn employees.</p>
          </div>

          <div className="card" style={{ flex: '1 1 300px', textAlign: 'center', padding: '3rem 2rem' }}>
            <BarChart3 size={48} color="var(--color-accent-rose)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem' }}>Live Analytics</h3>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Visual reporting letting you find exactly where your company capital is flowing with interactive pie charts.</p>
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: '8rem 2rem', background: 'var(--bg-main)', position: 'relative', zIndex: 10 }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Loved by finance teams.</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '5rem', fontSize: '1.1rem' }}>Don't just take our word for it—see what our partners say.</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
          {TESTIMONIALS.map((test, index) => (
            <div className="card" key={index} style={{ flex: '1 1 350px', position: 'relative', padding: '3rem 2rem 2rem 2rem' }}>
              <Quote size={40} color="var(--border-color)" style={{ position: 'absolute', top: '10%', right: '10%', opacity: 0.5 }} />
              <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', color: 'var(--color-success)' }}>
                <Star fill="currentColor" size={20} /> <Star fill="currentColor" size={20} /> <Star fill="currentColor" size={20} /> <Star fill="currentColor" size={20} /> <Star fill="currentColor" size={20} />
              </div>
              <p style={{ fontSize: '1.1rem', marginBottom: '2rem', fontStyle: 'italic', lineHeight: '1.6' }}>"{test.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={test.image} alt={test.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h5 style={{ fontSize: '1rem', margin: '0' }}>{test.name}</h5>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{test.role}, {test.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 2rem', display: 'flex', justifyContent: 'center', background: 'var(--bg-main)', position: 'relative', zIndex: 10 }}>
        <div style={{
          maxWidth: '1000px',
          width: '100%',
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-accent-rose) 100%)',
          borderRadius: '32px',
          padding: '5rem 3rem',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(56, 189, 248, 0.3)'
        }}>
          <Zap size={48} color="#fff" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '3.5rem', color: '#fff', marginBottom: '1.5rem', lineHeight: '1.1' }}>Ready to automate<br />your expenses?</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Join hundreds of forward-thinking companies already saving hours every week. Setup takes less than 5 minutes.
          </p>
          <Link to="/signup" className="btn" style={{ background: '#fff', color: 'var(--color-primary-dark)', padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '30px', fontWeight: 'bold' }}>
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary-dark)', margin: '0 0 1rem 0', letterSpacing: '0.05em' }}>Expensor.</h2>
        <p>&copy; {new Date().getFullYear()} Expensor Inc. All rights reserved.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
          <a href="#platform" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>
          <a href="#platform" style={{ color: 'var(--text-muted)' }}>Terms of Service</a>
          <a href="#platform" style={{ color: 'var(--text-muted)' }}>Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
