import { repository } from '../lib/discovery';

export async function RepositorySupport() {
  let stars: number | undefined;
  try {
    const response = await fetch('https://api.github.com/repos/Ameya79/chaff', {
      next: { revalidate: 3600 }, signal: AbortSignal.timeout(3500),
    });
    if (response.ok) {
      const data = await response.json();
      if (Number.isInteger(data.stargazers_count)) stars = data.stargazers_count;
    }
  } catch {
    // The repository link remains usable when GitHub is unavailable.
  }
  return <a className="btn font-mono text-xs" href={repository}>
    <span aria-hidden="true">&#9734;</span> Star on GitHub{stars !== undefined && <span> ({stars.toLocaleString('en-US')})</span>}
  </a>;
}
