import moment from "moment";
export const isEmpty = (value : string) => {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "string") return value.trim().length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

export const isNumber = (letter: string) => {
  return !isNaN(parseInt(letter));
};


export function formatToGermanTimestamp(timestamp: string): string {
  // Parse the timestamp into a Date object
  console.log("========timestamp:", timestamp);
  const date = new Date(timestamp);

  // Define formatting options for German style date and time
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  // Format and return the date in German format
  return new Intl.DateTimeFormat("de-DE", options).format(date);
}

export const getFormattedDate = (date: string) => {
  const temp = new Date(date);
  const tempdate = String(temp.getDate()).padStart(2, "0");
  const tempmonth = String(temp.getMonth() + 1).padStart(2, "0");
  const formattedDate = `${tempdate}.${tempmonth}.${temp.getFullYear()}`;
  return formattedDate;
}


export const isValidEmail = (email: string) => {
  if (email) {
    // Use a regular expression to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  } else {
    return true;
  }
};

export const formatedDate = (date: Date) => {
  const myMoment = moment(date);
  const modifiedMoment = myMoment.add(1, "day");
  const formattedMoment = modifiedMoment.format("YYYY-MM-DDTHH:mm:ss");
  console.log(formattedMoment); //
  return formattedMoment
}

export const localStorageUserInfo = () => {
  const user_id = window.localStorage.getItem("user_id") || "";
  const user_name = window.localStorage.getItem("user_name") || "";
  const user_email = window.localStorage.getItem("user_email") || "";
  const token = window.localStorage.getItem("token") || "";
  const localUserInfo = {
    user_id: user_id,
    user_name: user_name,
    user_email: user_email,
    token: token,
  };
  return localUserInfo;
};

export const modules = [
  { id: 1, name: "Training", knowledgeAreas: ["1.1", "1.2", "1.3", "1.3a"] },
  {
    id: 2,
    name: "Vorschriften für den Güterverkehr",
    knowledgeAreas: ["2.1", "2.2", "2.3"],
  },
  {
    id: 3,
    name: "Sicherheitstechnik und Fahrsicherheit",
    knowledgeAreas: ["1.2", "3.1", "3.5"],
  },
  {
    id: 4,
    name: "Schaltstelle Fahrer: Dienstleister, Imageträger, Profi",
    knowledgeAreas: ["3.2", "3.3", "3.4", "3.6", "3.7", "3.8"],
  },
  { id: 5, name: "Ladungssicherung", knowledgeAreas: ["1.4", "1.5", "1.6"] },
];

export const areasOfKnowledge: { [key: string]: string } = {
  "1.1":
    "Kenntnis der Eigenschaften der kinematischen Kette für eine optimierte Nutzung.",
  "1.2":
    "Kenntnis der technischen Merkmale und der Funktionsweise der Sicherheitsausstattung.",
  "1.3": "Fähigkeit zur Optimierung des Kraftstoffverbrauchs.",
  "1.3a":
    "Fähigkeit, Risiken im Straßenverkehr vorherzusehen, zu bewerten und sich daran anzupassen.",
  "1.4":
    "Fähigkeit zur Sicherung der Ladung unter Anwendung der Sicherheitsvorschriften und durch richtige Benutzung des Fahrzeugs.",
  "1.5":
    "Fähigkeit zur Gewährleistung der Fahrgastsicherheit und des Fahrgastkomforts.",
  "1.6":
    "Fähigkeit zur Sicherung der Ladung unter Anwendung der Sicherheitsvorschriften und durch richtige Benutzung des Fahrzeugs.",
  "2.1":
    "Kenntnis der sozialrechtlichen Rahmenbedigungen und Vorschriften für den Güter- oder Personenverkehr.",
  "2.2": "Kenntnis der Vorschriften für den Güterkraftverkehr.",
  "2.3": "Kenntnis der Vorschriften für den Personenverkehr.",
  "3.1":
    "Sensibilisierung in Bezug auf Risiken des Straßenverkehrs und Arbeitsunfälle.",
  "3.2":
    "Fähigkeit, der Kriminalität und der Schleusung illegaler Einwanderer vorzubeugen.",
  "3.3": "Fähigkeit, Gesundheitsschäden vorzubeugen.",
  "3.4":
    "Sensibilisierung für die Bedeutung einer guten körperlichen und geistigen Verfassung.",
  "3.5": "Fähigkeit zu richtiger Einschätzung der Lage bei Notfällen.",
  "3.6":
    "Fähigkeit zu einem Verhalten, das zu einem positiven Image des Unternehmens beiträgt.",
  "3.7":
    "Kenntnis des wirtschaftlichen Umfelds des Güterkraftverkehrs und der Marktordnung.",
  "3.8":
    "Kenntnis des wirtschaftlichen Umfelds des Personenkraftverkehrs und der Marktordnung.",
};


