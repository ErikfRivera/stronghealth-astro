// Physical clinic listings. Strong Health operates one physical clinic —
// Miami (Brickell). Every other metro is a telehealth service area served
// from cityPeptideConfig. Shared by Nav/Footer/hub components so the clinic
// list can never drift between surfaces.

export interface CityListing {
  slug: string;
  name: string;
  county: string;
  clinicName: string;
  area: string;
  phone: string;
}

export const MIAMI_CLINIC_LISTING: CityListing = {
  slug: "miami",
  name: "Miami",
  county: "Miami-Dade County",
  clinicName: "Strong Health Miami",
  area: "Brickell",
  phone: "(754) 263-6026",
};

export const PHYSICAL_CLINICS: CityListing[] = [MIAMI_CLINIC_LISTING];
