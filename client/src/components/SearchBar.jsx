import { useEffect, useState } from 'react';
import { searchUsers } from '../services/api';

export default function SearchBar({ onSelectUser }) {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState([]);

	useEffect(() => {
		const normalizedQuery = query.replace(/\D/g, '');
		if (normalizedQuery.length < 3) return setResults([]);
		const timer = setTimeout(async () => {
			try {
				const response = await searchUsers(normalizedQuery);
				setResults(response.data.users);
			} catch (_error) {
				setResults([]);
			}
		}, 300);
		return () => clearTimeout(timer);
	}, [query]);

	return (
		<div className="search-wrap">
			<div className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo số điện thoại" /></div>
			{results.length > 0 && <div className="search-results">{results.map((user) => <button key={user._id} onClick={() => { onSelectUser(user); setQuery(''); setResults([]); }}><span className="avatar small">{user.name.charAt(0)}</span><span><strong>{user.name}</strong><small>{user.phone}</small></span></button>)}</div>}
		</div>
	);
}
