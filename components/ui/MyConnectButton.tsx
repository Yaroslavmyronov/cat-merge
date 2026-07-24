import { ConnectButton } from '@rainbow-me/rainbowkit';

const baseClass =
  'bg-blue-500 text-white px-6 py-3 cursor-pointer transition-transform duration-100 active:translate-x-1 active:translate-y-1';

const baseStyle: React.CSSProperties = {
  fontSize: '14px',
  border: '3px solid #000',
  boxShadow: 'inset -4px -4px 0px rgba(0,0,0,0.2), 4px 4px 0px #000',
};

export const MyConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className={baseClass}
                    style={baseStyle}
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className={baseClass.replace('bg-blue-500', 'bg-red-500')}
                    style={baseStyle}
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    type="button"
                    className={baseClass}
                    style={baseStyle}
                  >
                    {chain.hasIcon && (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        style={{ width: 16, height: 16, display: 'inline', marginRight: 6 }}
                      />
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className={baseClass}
                    style={baseStyle}
                  >
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};