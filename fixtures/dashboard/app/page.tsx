'use client';
export default function DashboardPage() {
  console.log('Rendering Dashboard');
  return (
    <div className="p-8">
      <h2>Analytics Summary</h2>
      <div
        className="cursor-pointer bg-blue-500 text-white px-4 py-2"
        onClick={() => console.log('Export data clicked')}
      >
        Export CSV
      </div>
      <table className="mt-4">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Q1 Sales</td>
            <td>$1,234,567.89</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
