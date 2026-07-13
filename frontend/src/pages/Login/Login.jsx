function Login() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7fb', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 32, borderRadius: 16, background: '#fff', boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}>
        <h1 style={{ marginBottom: 8 }}>Welcome back !</h1>
        <p style={{ marginTop: 0, color: '#64748b' }}>Log in to your KhataBook Digital Ledger account.</p>
        <form style={{ display: 'grid', gap: 12 }}>
          <input style={{ padding: 12, borderRadius: 8, border: '1px solid #cbd5e1' }} placeholder="Email" />
          <input style={{ padding: 12, borderRadius: 8, border: '1px solid #cbd5e1' }} placeholder="Password" type="password" />
          <button style={{ padding: 12, borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer' }} type="button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;