import { useEffect, useState } from 'react';

export function useLiveValue(
  balance: number,
  incomeRate: number,
  serverTime: string,
) {
  const [displayBalance, setDisplayBalance] = useState(balance);

  useEffect(() => {
    const receivedAt = Date.now();
    setDisplayBalance(balance);

    const id = setInterval(() => {
      const elapsed = Math.max(0, (Date.now() - receivedAt) / 1000);
      setDisplayBalance(balance + incomeRate * elapsed);
    }, 1000);

    return () => clearInterval(id);
  }, [balance, incomeRate, serverTime]);

  return displayBalance;
}
