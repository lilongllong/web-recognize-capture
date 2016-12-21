
import Recognize from "./Recognize";
import setting from "../setting/setting";

const state = {
    "webType": null
}

$(document).ready(function() {
    setTimeout(() => {
        let webConfig = null;
        for( let key in setting )
        {
            const dom = $( setting[key].identification );
            console.log("dom", dom);
            if (dom && dom.length === 1) {
                // dom 存在
                state.webType = key;
                webConfig = setting[key].webConfig;
                break;
            }
        }

        if (!state.webType)
        {
            console.log("this webpage is not  a matched target webpage. ");
        }
        else
        {
            new Recognize({
                webConfig,
                state
            });
        }
    }, 300);
});
