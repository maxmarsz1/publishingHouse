export interface Publisher {
    id: number;
    name: string;
    description: string;
}

export interface Raport {
    id: number,
    title: string,
    status: Status,
    grade: number,
    publisher: Publisher
}

export enum Status{
    Sent = 1,
    Pending,
    Approved,
    Published,
    Rejected
}

export enum RaportType {
    OriginalResearch = "Artykuł oryginalny",
    ReviewArticle = "Artykuł przeglądowy",
    SystematicReview = "Przegląd systematyczny",
    MetaAnalysis = "Metaanaliza",
    CaseReport = "Raport przypadku / Studium przypadku",
    ShortCommunication = "Krótki komunikat / Krótki raport",
    MethodArticle = "Artykuł metodologiczny",
    Commentary = "Komentarz / Opinia / List do redakcji",
    TheoreticalPaper = "Artykuł teoretyczny",
    ClinicalTrialReport = "Raport z badania klinicznego",
    SoftwareToolArticle = "Artykuł oprogramowania",
    TechnicalReport = "Raport techniczny",
    Other = "Inny"
}

export enum ITRaportCategory {
    ArtificialIntelligence = "Sztuczna Inteligencja (AI)",
    MachineLearning = "Uczenie Maszynowe (ML)",
    DataScience = "Data Science / Analiza Danych",
    Cybersecurity = "Cyberbezpieczeństwo",
    CloudComputing = "Przetwarzanie w Chmurze (Cloud Computing)",
    WebDevelopment = "Tworzenie Aplikacji Webowych",
    MobileDevelopment = "Tworzenie Aplikacji Mobilnych",
    GameDevelopment = "Tworzenie Gier",
    DevOps = "DevOps",
    Networking = "Sieci Komputerowe",
    Databases = "Bazy Danych",
    OperatingSystems = "Systemy Operacyjne",
    SoftwareEngineering = "Inżynieria Oprogramowania",
    ComputerGraphics = "Grafika Komputerowa",
    Robotics = "Robotyka",
    InternetOfThings = "Internet Rzeczy (IoT)",
    Blockchain = "Blockchain / Kryptowaluty",
    QuantumComputing = "Obliczenia Kwantowe",
    HumanComputerInteraction = "Interakcja Człowiek-Komputer (HCI)",
    Other = "Inne"
}