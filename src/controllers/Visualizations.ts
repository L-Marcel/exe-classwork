import { Prisma as P } from "@prisma/client";
import { Prisma } from "../services/prisma";
import { Alerts } from "./Alerts";

export class Visualizations {
  static async isNotVisualizedByUser(userId: string) {
    const alerts = await Alerts.getAllByUser(userId);

    let alertsNotVisualized = [];
    
    for(let a in alerts) {
      const isVisualized = await this.isVisualized(alerts[a].id, userId);

      if(!isVisualized) {
        alertsNotVisualized.push(alerts[a]);
      };
    };

    return alertsNotVisualized as typeof alerts;
  };

  static async isVisualized(alertId: string, userId: string) {
    const visualization = await Prisma.visualization.findUnique({
      where: {
        userId_alertId: {
          alertId,
          userId
        }
      }
    });

    if(visualization) {
      return true;
    };

    return false;
  };

  static async alertsVisualizedBy(alerts: P.VisualizationCreateManyInput[]) {
    const data = await Promise.all(alerts.map(async(a) => {
      const isVisualized = await this.isVisualized(a.alertId, a.userId);
     
      if(!isVisualized) {
        return a;
      };

      return null;
    }));

    return await Prisma.visualization.createMany({
      data: data.filter(a => a !== null)
    });
  };
};