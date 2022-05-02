import "./swap.scss";

function Swap() {
    return (
        <div className="swap-view">
            <iframe
                src="https://app.uniswap.org/#/swap?inputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&outputCurrency=0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"
                height="660px"
                width="100%"
            />
        </div>
    );
}

export default Swap;
