export interface Publisher {
    id: number;
    name: string;
    description: string;
}

export interface UserArticles {
    authored_articles: Article[],
    articles_to_review: Article[]
}

export interface User {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    articles?: Article[],
    articlesToReview?: Article[]
}

export interface Article {
    id: number,
    title: string,
    abstract: string,
    articleType: ArticleType,
    articleCategory: ITArticleCategory,
    author: User,
    status: Status,
    grade: number,
    publisher: Publisher,
    toReview?: boolean,
    filePath?: string,   // Optional for now
    reviewers?: User[]
}

export enum Status{
    Sent = 1,
    Pending,
    Approved,
    Published,
    Rejected
}

export enum ArticleType {
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

export enum ITArticleCategory {
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