interface IXYChartDataSettings {
  numberOfValueFields?: number;
  valueRanges?: Array<[number, number]>;
  valueFieldNames?: string[];
}
interface ICategoryChartDataSettings extends IXYChartDataSettings {
  numberOfDataItems?: number;
}
interface IDateXYChartDataSettings extends IXYChartDataSettings {
  fromDate?: Date;
  toDate?: Date;
  interval?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';
}

export default class SampleDataGenerator {
  public static getCategoryChartData(
    options?: ICategoryChartDataSettings
  ): Array<object> {
    const numberOfDataItems =
      options && options.numberOfDataItems ? options.numberOfDataItems : 8;
    const numberOfValueFields =
      options && options.numberOfValueFields ? options.numberOfValueFields : 1;

    const result: Array<object> = [];
    for (let i = 0; i < numberOfDataItems; i++) {
      result.push(
        SampleDataGenerator.getObjectWithValues(
          { category: `Category #${i + 1}` },
          numberOfValueFields,
          options
        )
      );
    }
    return result;
  }

  public static getDateXYChartData(
    options?: IDateXYChartDataSettings
  ): Array<object> {
    const interval = options && options.interval ? options.interval : 'day';
    const toDate = options && options.toDate ? options.toDate : new Date();
    const autoFromDate = new Date(toDate);
    autoFromDate.setDate(autoFromDate.getDate() - 10);
    const fromDate =
      options && options.fromDate ? options.fromDate : autoFromDate;
    const numberOfValueFields =
      options && options.numberOfValueFields ? options.numberOfValueFields : 1;

    const result: Array<object> = [];

    const currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      result.push(
        SampleDataGenerator.getObjectWithValues(
          { date: new Date(currentDate) },
          numberOfValueFields,
          options
        )
      );
      switch (interval) {
        case 'day':
        default: {
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        }
        case 'month': {
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        }
        case 'year': {
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
        }
        case 'hour': {
          currentDate.setHours(currentDate.getHours() + 1);
          break;
        }
        case 'minute': {
          currentDate.setMinutes(currentDate.getMinutes() + 1);
          break;
        }
        case 'second': {
          currentDate.setSeconds(currentDate.getSeconds() + 1);
          break;
        }
      }
    }
    return result;
  }

  private static getObjectWithValues(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemObject: any,
    numberOfValueFields: number,
    options?: ICategoryChartDataSettings
  ): object {
    for (let vi = 0; vi < numberOfValueFields; vi++) {
      const valueFieldName =
        options && options.valueFieldNames && options.valueFieldNames[vi]
          ? options.valueFieldNames[vi]
          : `value${numberOfValueFields > 1 ? vi + 1 : ''}`;
      const valueRange =
        options && options.valueRanges ? options.valueRanges[vi] : undefined;
      itemObject[valueFieldName] = SampleDataGenerator.getRandomValue(
        valueRange
      );
    }

    return itemObject;
  }

  private static getRandomValue(range?: [number, number]): number {
    const min = range ? range[0] : 100;
    const max = range ? range[1] : 5000;

    return Math.round(Math.random() * (max - min)) + min;
  }
}
