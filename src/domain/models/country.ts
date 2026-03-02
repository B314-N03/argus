export interface Country {
  iso3: string;
  name: string;
  headOfState: string;
  headOfGovernment: string;
  governmentType: string;
  militaryBranches: string[];
  activePersonnel?: number;
  reservePersonnel?: number;
  alliances: string[];
  region: string;
  population?: number;
  capital?: string;
}
