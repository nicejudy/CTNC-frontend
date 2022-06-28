import "./swap.scss";
import { SWAP_URL } from "src/constants/data";
import { ETH_ADDRESSES } from "src/constants/addresses";


function Swap() {
    return (
        <div className="swap-view">
            <iframe
                src={`${SWAP_URL}inputCurrency=${ETH_ADDRESSES.USDT_ADDRESS}&outputCurrency=${ETH_ADDRESSES.CML_ADDRESS}`}
                height="660px"
                width="100%"
            />
        </div>
    );
}

export default Swap;
