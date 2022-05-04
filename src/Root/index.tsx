import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";

function Root() {
    return (
        <QueryParamProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </QueryParamProvider>
    );
}

export default Root;
