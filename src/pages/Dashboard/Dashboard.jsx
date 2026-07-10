function Dashboard() {
  const stats = [
    { label: 'Current Balance', value: '₹24,500', tone: '#16a34a' },
    { label: 'Total Credits', value: '₹48,200', tone: '#2563eb' },
    { label: 'Total Debits', value: '₹23,700', tone: '#dc2626' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 8 }}>Dashboard</h1>
        <p style={{ marginTop: 0, color: '#64748b' }}>A quick overview of your ledger activity.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          {stats.map((item) => (
            <div key={item.label} style={{ background: '#fff', padding: 20, borderRadius: 14, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ color: '#64748b', fontSize: 14 }}>{item.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8, color: item.tone }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', padding: 20, borderRadius: 14, boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
          <h2 style={{ marginTop: 0 }}>Recent Transactions</h2>
          <ul style={{ paddingLeft: 20, color: '#334155', lineHeight: 1.7 }}>
            <li>Ravi Kumar — Credit ₹2,500</li>
            <li>Neha Traders — Debit ₹800</li>
            <li>Ajay Store — Credit ₹1,200</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;