function hasIntersection(set1: Set<string>, set2: Set<string>) {
  const it1 = set1.entries();
  let value = it1.next();
  while (!value.done) {
    if (set2.has(value.value[0])) {
      return true;
    }
    value = it1.next();
  }
  return false;
}

type ComputedProperty = {
  value: any;
  watchedProperties: Set<string>;
  compute: () => void;
};

export class StormModel {
  _propertiesAccessed: Set<String>;
  _computedProperties: Map<string, ComputedProperty> = new Map();

  _initComputed() {
    this._computedProperties.forEach(computed => {
      this._computeProperty(computed);
    });
  }

  _computeProperty(computedProperty: ComputedProperty) {
    computedProperty.watchedProperties.clear();
    const prevPropertiesAccessed = this._propertiesAccessed;
    this._propertiesAccessed = computedProperty.watchedProperties;
    computedProperty.value = computedProperty.compute();
    this._propertiesAccessed = prevPropertiesAccessed;
  }

  _registerAccess(property: string) {
    if (this._propertiesAccessed) {
      this._propertiesAccessed.add(property);
    }
  }

  set(data = {}) {
    const changedProperties = new Set<string>();
    Object.entries(data).forEach(val => {
      const key = `__${val[0]}`;
      if (this[key] !== val[1]) {
        this[key] = val[1];
        changedProperties.add(val[0]);
      }
    });

    this._computedProperties.forEach((computed, key) => {
      if (hasIntersection(changedProperties, computed.watchedProperties)) {
        changedProperties.add(key);
        this._computeProperty(computed);
      }
    });
  }
}
