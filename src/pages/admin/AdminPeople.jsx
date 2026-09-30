import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

export default function AdminPeople({ role = 'user' }) {
  const sellers = role === 'seller';
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);
  const key = JSON.stringify([role, query, page, retry]);
  const [result, setResult] = useState({ key: '', users: [], total: 0, pages: 0, error: '' });
  const loading = result.key !== key;

  useEffect(() => {
    let active = true;
    API.get('/admin/users', { params: { role, search: query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), page, limit: 20 } })
      .then(({ data }) => {
        if (active) setResult({ key, users: data.users || [], total: data.pagination?.total || 0, pages: data.pagination?.pages || 0, error: '' });
      })
      .catch(error => {
        if (active) setResult({ key, users: [], total: 0, pages: 0, error: error.response?.data?.message || 'Unable to load accounts. Please try again.' });
      });
    return () => { active = false; };
  }, [role, query, page, retry, key]);

  return (
    <section className="space-y-5 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{sellers ? 'Seller Accounts' : 'Customers'}</h1>
          <p className="text-sm text-amazon-text-secondary mt-1">{sellers ? 'View registered seller accounts.' : 'View registered customer accounts.'}</p>
        </div>
        {sellers && <Link className="text-sm font-semibold text-amazon-accent underline" to="/admin/sellers">Review seller applications</Link>}
      </div>
      <form className="flex flex-wrap gap-2" onSubmit={event => { event.preventDefault(); setPage(1); setQuery(search.trim()); }}>
        <input aria-label="Search accounts by name or email" placeholder="Search name or email" value={search} maxLength={150} onChange={event => setSearch(event.target.value)} className="min-w-0 flex-1 basis-48 border rounded-lg px-3 py-2" />
        <button className="bg-amazon-accent rounded-lg px-4 py-2 font-semibold" type="submit">Search</button>
        {query && <button type="button" className="border rounded-lg px-4 py-2" onClick={() => { setSearch(''); setQuery(''); setPage(1); }}>Clear</button>}
      </form>
      {loading ? <p role="status">Loading accounts…</p> : result.error ? (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          <p>{result.error}</p>
          <button className="mt-2 underline" onClick={() => setRetry(value => value + 1)}>Retry</button>
        </div>
      ) : <>
        <p className="text-sm text-amazon-text-secondary">{result.total} {sellers ? 'seller' : 'customer'} accounts{query ? ' matching your search' : ''}</p>
        {!result.users.length ? <p className="rounded-xl border bg-white p-6">{query ? 'No accounts match your search.' : sellers ? 'No seller accounts yet. Approved sellers will appear here.' : 'No customer accounts yet.'}</p> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {result.users.map(person => <article key={person._id} className="min-w-0 bg-white border border-amazon-border rounded-xl p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <h2 className="font-bold break-words min-w-0">{person.name || 'Unnamed account'}</h2>
                <span className="text-xs rounded-full bg-amazon-section px-3 py-1 capitalize">{person.accountStatus || 'active'}</span>
              </div>
              <p className="text-sm break-all mt-2">{person.email || 'No email provided'}</p>
              {person.phone && <p className="text-sm break-all mt-1">{person.phone}</p>}
              <p className="text-xs text-amazon-text-secondary mt-3">Joined: {person.createdAt && !Number.isNaN(Date.parse(person.createdAt)) ? new Date(person.createdAt).toLocaleDateString() : 'Not recorded'}</p>
            </article>)}
          </div>
        )}
        {result.pages > 1 && <nav aria-label="Account pagination" className="flex flex-wrap items-center gap-3">
          <button disabled={page === 1} onClick={() => setPage(value => value - 1)} className="border rounded-lg px-3 py-2 disabled:opacity-40">Previous</button>
          <span className="text-sm">Page {page} of {result.pages}</span>
          <button disabled={page >= result.pages} onClick={() => setPage(value => value + 1)} className="border rounded-lg px-3 py-2 disabled:opacity-40">Next</button>
        </nav>}
      </>}
    </section>
  );
}
