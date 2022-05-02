import "./chart.scss";

function Chart() {
    return (
        <div className="chart-view">
            <iframe src="https://dexscreener.com/fantom/0x0667eC775E43897ebc3199F6Cf822C6028628f3E?embed=1&theme=dark&trades=0&info=0" height="660px" width="100%" />
        </div>
    );
}

export default Chart;
