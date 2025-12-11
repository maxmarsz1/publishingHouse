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
    status: ArticleStatus,
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
    decision?: ReviewDecision,
    review_date: string,
    status: ReviewStatus,
    grade: number,
    custom_grade?: number,
    content_consistency?: number,
    goal_formulation?: number,
    structure_correctness?: number,
    terminology_relevance?: number,
    graphic_design?: number,
    aesthetics?: number,
    literature_selection?: number,
    conclusions_correctness?: number,
    goal_achievement?: number,
    language_correctness?: number;
    is_admin_review?: boolean;
}

export enum ReviewStatus {
    Pending = "pending",
    Sumbitted = "submitted",
    Approved = "approved",
    Invited = "invited",
    InviteRejected = "invite_rejected"
}

export const ReviewStatusDisplay: Record<ReviewStatus, string> = {
    [ReviewStatus.Pending]: "Oczekuje",
    [ReviewStatus.Sumbitted]: "Wysłana",
    [ReviewStatus.Approved]: "Zatwierdzona",
    [ReviewStatus.Invited]: "Zaproszony(a) do recenzji",
    [ReviewStatus.InviteRejected]: "Zaproszenie odrzucone",
}

export enum ReviewDecision {
    Accept = "accept",
    MinorRevision = "minor_revision",
    MajorRevision = "major_revision",
    Reject = "reject",
}

export const ReviewDecisionDisplay: Record<ReviewDecision, string> = {
    [ReviewDecision.Accept]: "Akceptacja",
    [ReviewDecision.MinorRevision]: "Drobne poprawki",
    [ReviewDecision.MajorRevision]: "Znaczne poprawki",
    [ReviewDecision.Reject]: "Odrzucenie",
}

export enum ArticleStatus {
    Pending = "pending",
    Approved = "approved",
    Published = "published",
    Rejected = "rejected",
    WaitingForRevision = "waiting_for_revision",
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



export const reviewCriteriaDisplay: Record<string, string> = {
    content_consistency: 'Zgodność treści pracy z tematem',
    goal_formulation: 'Sformułowanie celu pracy',
    structure_correctness: 'Poprawność układu pracy',
    terminology_relevance: 'Trafność zastosowanej terminologii',
    graphic_design: 'Opracowanie graficzne pracy',
    aesthetics: 'Estetyka pracy',
    literature_selection: 'Dobór literatury',
    conclusions_correctness: 'Poprawność sformułowanych wniosków',
    goal_achievement: 'Osiągnięcie celu pracy',
    language_correctness: 'Stylistyka i poprawność językowa'
};