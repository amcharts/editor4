export default class IdHelper {
  private _prefix: string;
  private _ids: string[] = [];
  private _maxId = 0;

  private _idSchemeMatcher: RegExp;

  public constructor(prefix?: string) {
    this._prefix = prefix !== undefined ? prefix : 'id-';
    this._idSchemeMatcher = new RegExp(`^${this._prefix}([0-9]*)$`, 'g');
  }

  public init(config: object) {
    this._ids = [];
    this._maxId = 0;

    this.processConfig(config);
  }

  public getNewId(): string {
    this._maxId++;
    const newId = `${this._prefix}${this._maxId}`;
    this._ids.push(newId);
    return newId;
  }

  private processConfig(config: object | []) {
    if (Array.isArray(config)) {
      config.forEach(el => {
        if (Array.isArray(el) || (typeof el === 'object' && el !== null)) {
          this.processConfig(el);
        }
      });
    } else {
      this.processObject(config);
    }
  }

  private processObject(config: object) {
    if (config !== null) {
      const idIndex = Object.keys(config).indexOf('id');
      if (idIndex >= 0) {
        const idValue = Object.values(config)[idIndex].toString();
        this._ids.push(idValue);

        const idMatch = this._idSchemeMatcher.exec(idValue);
        if (idMatch !== null && idMatch.length > 1) {
          const idNumber = Number.parseInt(idMatch[1]);
          if (idNumber > this._maxId) {
            this._maxId = idNumber;
          }
        }
      }

      Object.values(config).forEach(val => {
        if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
          this.processConfig(val);
        }
      });
    }
  }
}
