import { Prisma as P } from "@prisma/client";
import { Prisma } from "../services/prisma";

export class Visualizations {
  static async isVisualized(alertId: string, userId) {
    const visualization = Prisma.visualization.findUnique({
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