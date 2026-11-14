/** YYYY-MM-DD, `days` from today, so tests never search the past by accident. */
export function dateFromToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const traveller = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '5551234567',
};
