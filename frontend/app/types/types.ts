export interface Publisher {
    id: number;
    name: string;
    description?: string;
    dueDate?: string;
    joinCode?: string;
    members?: User[];
}

export interface UserArticles {
    authored_articles: Article[],
    user_reviews: Review[]
}

export interface User {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    email?: string,
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
    keywords: string,
    comment: string,
    createdAt: string,
    grade?: number,
    publisher: Publisher,
    toReview?: boolean,
    review?: Review,
    isAuthor?: boolean,
    reviews?: Review[],
    reviewers?: User[],
    file?: File,
}

export interface NewArticle {
    title: string,
    abstract: string,
    articleType: ArticleType,
    articleCategory: ITArticleCategory,
    comment: string,
    keywords: string,
    file: File,
    publisherId: number
}

export interface Review {
    id: number,
    raport?: Article,
    reviewer?: User,
    comment: string,
    review_date: string,
    status: ReviewStatus,
    grade: number,
}

export enum ReviewStatus {
    Pending = "pending",
    Sumbitted = "submitted",
    Invited = "invited",
    InviteRejected = "invite_rejected"
}

export const ReviewStatusDisplay: Record<ReviewStatus, string> = {
    [ReviewStatus.Pending]: "Oczekuje",
    [ReviewStatus.Sumbitted]: "Wysłana",
    [ReviewStatus.Invited]: "Zaproszony do recenzji",
    [ReviewStatus.InviteRejected]: "Zaproszenie odrzucone",
}

export enum Status {
    Sent = "sent",
    Pending = "pending",
    Approved = "approved",
    Published = "published",
    Rejected = "rejected",
}

export enum ArticleType {
    OriginalResearch = "original_research", // Artykuł oryginalny
    ReviewArticle = "review_article", // Artykuł przeglądowy
    SystematicReview = "systematic_review", // Przegląd systematyczny
    MetaAnalysis = "meta_analysis", // Metaanaliza
    CaseReport = "case_report", // Raport przypadku / Studium przypadku
    ShortCommunication = "short_communication", // Krótki komunikat / Krótki raport
    MethodArticle = "method_article", // Artykuł metodologiczny
    Commentary = "commentary", // Komentarz / Opinia / List do redakcji
    TheoreticalPaper = "theoretical_paper", // Artykuł teoretyczny
    ClinicalTrialReport = "clinical_trial_report", // Raport z badania klinicznego
    SoftwareToolArticle = "software_tool_article", // Artykuł oprogramowania
    TechnicalReport = "technical_report", // Raport techniczny
    Other = "other", // Inny
}

export const ArticleTypeDisplay: Record<ArticleType, string> = {
    [ArticleType.OriginalResearch]: "Artykuł oryginalny",
    [ArticleType.ReviewArticle]: "Artykuł przeglądowy",
    [ArticleType.SystematicReview]: "Przegląd systematyczny",
    [ArticleType.MetaAnalysis]: "Metaanaliza",
    [ArticleType.CaseReport]: "Raport przypadku / Studium przypadku",
    [ArticleType.ShortCommunication]: "Krótki komunikat / Krótki raport",
    [ArticleType.MethodArticle]: "Artykuł metodologiczny",
    [ArticleType.Commentary]: "Komentarz / Opinia / List do redakcji",
    [ArticleType.TheoreticalPaper]: "Artykuł teoretyczny",
    [ArticleType.ClinicalTrialReport]: "Raport z badania klinicznego",
    [ArticleType.SoftwareToolArticle]: "Artykuł oprogramowania",
    [ArticleType.TechnicalReport]: "Raport techniczny",
    [ArticleType.Other]: "Inny",
};

export enum ITArticleCategory {
    ArtificialIntelligence = "artificial_intelligence", // Sztuczna Inteligencja (AI)
    MachineLearning = "machine_learning", // Uczenie Maszynowe (ML)
    DataScience = "data_science", // Data Science / Analiza Danych
    Cybersecurity = "cybersecurity", // Cyberbezpieczeństwo
    CloudComputing = "cloud_computing", // Przetwarzanie w Chmurze (Cloud Computing)
    WebDevelopment = "web_development", // Tworzenie Aplikacji Webowych
    MobileDevelopment = "mobile_development", // Tworzenie Aplikacji Mobilnych
    GameDevelopment = "game_development", // Tworzenie Gier
    DevOps = "devops", // DevOps
    Networking = "networking", // Sieci Komputerowe
    Databases = "databases", // Bazy Danych
    OperatingSystems = "operating_systems", // Systemy Operacyjne
    SoftwareEngineering = "software_engineering", // Inżynieria Oprogramowania
    ComputerGraphics = "computer_graphics", // Grafika Komputerowa
    Robotics = "robotics", // Robotyka
    InternetOfThings = "internet_of_things", // Internet Rzeczy (IoT)
    Blockchain = "blockchain", // Blockchain / Kryptowaluty
    QuantumComputing = "quantum_computing", // Obliczenia Kwantowe
    HumanComputerInteraction = "human_computer_interaction", // Interakcja Człowiek-Komputer (HCI)
    Other = "other", // Inne
}

export const ITArticleCategoryDisplay: Record<ITArticleCategory, string> = {
    [ITArticleCategory.ArtificialIntelligence]: "Sztuczna Inteligencja (AI)",
    [ITArticleCategory.MachineLearning]: "Uczenie Maszynowe (ML)",
    [ITArticleCategory.DataScience]: "Data Science / Analiza Danych",
    [ITArticleCategory.Cybersecurity]: "Cyberbezpieczeństwo",
    [ITArticleCategory.CloudComputing]: "Przetwarzanie w Chmurze (Cloud Computing)",
    [ITArticleCategory.WebDevelopment]: "Tworzenie Aplikacji Webowych",
    [ITArticleCategory.MobileDevelopment]: "Tworzenie Aplikacji Mobilnych",
    [ITArticleCategory.GameDevelopment]: "Tworzenie Gier",
    [ITArticleCategory.DevOps]: "DevOps",
    [ITArticleCategory.Networking]: "Sieci Komputerowe",
    [ITArticleCategory.Databases]: "Bazy Danych",
    [ITArticleCategory.OperatingSystems]: "Systemy Operacyjne",
    [ITArticleCategory.SoftwareEngineering]: "Inżynieria Oprogramowania",
    [ITArticleCategory.ComputerGraphics]: "Grafika Komputerowa",
    [ITArticleCategory.Robotics]: "Robotyka",
    [ITArticleCategory.InternetOfThings]: "Internet Rzeczy (IoT)",
    [ITArticleCategory.Blockchain]: "Blockchain / Kryptowaluty",
    [ITArticleCategory.QuantumComputing]: "Obliczenia Kwantowe",
    [ITArticleCategory.HumanComputerInteraction]: "Interakcja Człowiek-Komputer (HCI)",
    [ITArticleCategory.Other]: "Inne",
};