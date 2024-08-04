import { dispatcherJsConfig } from '../dispatcherJsConfig.js';

export const FEATURE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export class Feature {
  name;
  status = FEATURE_STATUS.ACTIVE;
  entry;
  params;
  timeAdded;
  prerequisites = [];

  constructor(name, entry, prerequisites) {
    this.name = name;
    this.entry = entry;
    this.prerequisites = prerequisites;
  }

  clone() {
    const newFeature = new Feature();
    newFeature.name = this.name;
    newFeature.status = this.status;
    newFeature.entry = this.entry;
    newFeature.params = this.params;
    newFeature.timeAdded = this.timeAdded;
    newFeature.prerequisites = this.prerequisites;
    return newFeature;
  }

  getPrerequisitesAndFeature() {
    if (!this.prerequisites) return [this.clone()];

    const res = [];
    this.prerequisites.forEach((item) => {
      if (dispatcherJsConfig.allFeatureSet[item]) res.push(...dispatcherJsConfig.allFeatureSet[item].getPrerequisitesAndFeature());
    });
    res.push(this.clone());
    return res;
  }

  setInactive() {
    this.status = FEATURE_STATUS.INACTIVE;
    return this;
  }
}
