import Point from "./Point";
import PointCloud from "./PointCloud";
import Util from "./Util";

export default class PDollarRecognizer
{
    constructor()
    {
        const NumPointClouds = 4;
        this.PointClouds = new Array(NumPointClouds);
        this.PointClouds[0] = new PointCloud({ name: "X", points: new Array(
            new Point(0,0,1),new Point(100,100,1),
            new Point(200,200,1),new Point(200,0,2),
            new Point(100,100,2),new Point(0,200,2)
        ) });
        const pai = 100 * Math.sqrt(2);
        this.PointClouds[1] = new PointCloud({ name: "circle", points: new Array(
            new Point(0,100,1),new Point(100 - pai, 100 + pai,1),
            new Point(100,200,1),new Point(100 + pai, 100 + pai, 1),
            new Point(200,100,1),new Point(100 + pai, 100 - pai,1),
            new Point(100,0,1),new Point(100 - pai, 100 - pai, 1)
        )});
        this.PointClouds[2] = new PointCloud({ name: ">", points: new Array(
            new Point(0,0,1),new Point(100,100,1),
            new Point(0,200,1)
        )});
        this.PointClouds[3] = new PointCloud({ name: "<", points: new Array(
            new Point(100,0,1),new Point(0,100,1),
            new Point(100,200,1)
        )});
    }

    Recognize(points)
    {
        points = new PointCloud({ name: "未知", points: points }).points;
        var b = +Infinity;
        var u = -1;
        for (var i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
        {
            console.log(this.PointClouds);
            var d = Util.getInstance().GreedyCloudMatch(points, this.PointClouds[i]);
            if (d < b) {
                b = d; // best (least) distance
                u = i; // point-cloud
            }
        }
        return (u == -1) ? { Name: "No match.", Score: 0.0 } : Object.assign({path: this.PointClouds[u].originPoints},{ Name: this.PointClouds[u].name, Score: Math.max((b - 2.0) / -2.0, 0.0) });
    };
}
